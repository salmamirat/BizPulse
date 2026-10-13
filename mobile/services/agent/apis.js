import api from '../apiClient';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
const API_URL = Platform.OS === 'ios' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api';

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
  const response = await fetch(`${API_URL}/agent/chat/stream`, {
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

  if (!response.body?.getReader) {
    const data = await sendMessage(message, conversationId);
    onConversation(data.conversationId);
    onWord(data.reply);
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
      if (part.startsWith("event: conversation")) {
        const line = part.split("data: ")[1];
        if (line) onConversation(line.trim());
      }

      if (part.startsWith("data: ")) {
        const text = part.replace("data: ", "").trim();
        if (text && text !== "[DONE]") onWord(`${text} `);
      }
    }
  }
}

