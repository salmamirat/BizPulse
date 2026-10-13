import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as apis from './apis';

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ message, conversationId }) => apis.sendMessage(message, conversationId),
    onSuccess: (_, variables) => {
      if (variables.conversationId) {
         queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};
