import api from '../apiClient';

export async function getTransactions(params = {}) {
  const { data } = await api.get('/transactions', { params });
  return data;
}

export async function createTransaction(data) {
  const response = await api.post('/transactions', data);
  return response.data;
}

export async function updateTransaction(id, data) {
  const response = await api.put(/transactions/, data);
  return response.data;
}

export async function deleteTransaction(id) {
  const response = await api.delete(/transactions/);
  return response.data;
}
