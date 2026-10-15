import axios from "axios";
import * as SecureStore from "expo-secure-store";
import useAuthStore from "../store/authStore";
import { Platform } from "react-native";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "ios" ? "http://localhost:5000/api" : "http://10.0.2.2:5000/api");

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

export default api;
