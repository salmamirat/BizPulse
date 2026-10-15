import api from "../client";

export async function getConversations() {
  const { data } = await api.get("/agent/conversations");
  return data;
}

export async function getMessages(id) {
  const { data } = await api.get(`/agent/conversations/${id}/messages`);
  return data;
}

export async function sendMessage(message, conversationId) {
  const { data } = await api.post(
    "/agent/chat",
    {
      message,
      ...(conversationId ? { conversationId } : {})
    },
    { timeout: 60000 }
  );
  return data;
}
