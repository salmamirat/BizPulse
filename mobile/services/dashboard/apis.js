import api from '../apiClient';

export async function getDashboard() {
  const { data } = await api.get('/dashboard/summary');
  return data;
}
