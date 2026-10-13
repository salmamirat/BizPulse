import { useQuery } from '@tanstack/react-query';
import * as apis from './apis';

export const useDashboardSummary = () => useQuery({
  queryKey: ['dashboard'],
  queryFn: apis.getDashboard
});
