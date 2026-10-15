import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "./api";

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ message, conversationId }) => sendMessage(message, conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    }
  });
}
