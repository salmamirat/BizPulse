import axios from "axios";
import * as SecureStore from "expo-secure-store";
import useAuthStore from "../store/authStore";
import { fetch as expoFetch } from "expo/fetch";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing = false;
let waiting = [];

function resolveWaiting(error, token = null) {
  waiting.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  waiting = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original?._retry || !await SecureStore.getItemAsync("refreshToken")) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (refreshing) {
      return new Promise((resolve, reject) => {
        waiting.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    refreshing = true;

    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      const newToken = response.data.accessToken;

      await useAuthStore.getState().setAccessToken(newToken);
      resolveWaiting(null, newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      resolveWaiting(refreshError);
      await useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      refreshing = false;
    }
  }
);

export async function login(email, motDePasse) {
  const { data } = await api.post("/auth/login", { email, motDePasse });
  return data;
}

export async function register(nom, email, motDePasse, secteur) {
  const { data } = await api.post("/auth/register", { nom, email, motDePasse, secteur });
  return data;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {}
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function getDashboard() {
  const { data } = await api.get("/dashboard/summary");
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/dashboard/categories");
  return data;
}

export async function getTransactions(params = {}) {
  const { data } = await api.get("/transactions", { params });
  return data;
}

export async function createTransaction(data) {
  const response = await api.post("/transactions", data);
  return response.data;
}

export async function updateTransaction(id, data) {
  const response = await api.put(`/transactions/${id}`, data);
  return response.data;
}

export async function deleteTransaction(id) {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
}

export async function getConversations() {
  const { data } = await api.get("/agent/conversations");
  return data;
}

export async function getMessages(id) {
  const { data } = await api.get(`/agent/conversations/${id}/messages`);
  return data;
}

export async function sendMessage(message, conversationId) {
  const { data } = await api.post("/agent/chat", {
    message,
    ...(conversationId ? { conversationId } : {})
  });
  return data;
}

export async function streamMessage(message, conversationId, onWord, onConversation) {
  const token = await SecureStore.getItemAsync("accessToken");
  
  // Utilise expoFetch pour supporter le streaming
  const response = await expoFetch(`${API_URL}/agent/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      message,
      ...(conversationId ? { conversationId } : {})
    })
  });

  if (!response.ok) {
    throw new Error("L'assistant IA est indisponible");
  }

  // Parse les morceaux reçus (SSE)
  const processPart = (part) => {
    if (part.startsWith("event: conversation")) {
      const line = part.split("data: ")[1];
      if (line) onConversation(line.trim());
    } else if (part.startsWith("data: ")) {
      const text = part.substring(6);
      if (text === "[DONE]") return;
      try {
        const parsed = JSON.parse(text);
        onWord(parsed);
      } catch (e) {
        onWord(text);
      }
    }
  };

  // Si pas de reader, on lit tout d'un coup
  if (!response.body?.getReader) {
    const text = await response.text();
    const parts = text.split("\n\n");
    for (const part of parts) {
      if (part) processPart(part);
    }
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      if (part) processPart(part);
    }
  }
}

export default api;
