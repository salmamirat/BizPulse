import { useQuery } from '@tanstack/react-query';
import * as apis from './apis';

export const useTransactions = (params) => useQuery({
  queryKey: ['transactions', params],
  queryFn: () => apis.getTransactions(params)
});
