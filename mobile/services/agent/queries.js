import { useQuery } from '@tanstack/react-query';
import * as apis from './apis';

export const useConversations = () => useQuery({
  queryKey: ['conversations'],
  queryFn: apis.getConversations
});

export const useMessages = (conversationId) => useQuery({
  queryKey: ['messages', conversationId],
  queryFn: () => apis.getMessages(conversationId),
  enabled: !!conversationId
});
