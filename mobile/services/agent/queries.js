import { useQuery } from "@tanstack/react-query";
import { getConversations, getMessages } from "./api";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations
  });
}

export function useMessages(conversationId) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId
  });
}
