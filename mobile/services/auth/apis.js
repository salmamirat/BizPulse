import api from '../apiClient';

export async function login(email, motDePasse) {
  const { data } = await api.post('/auth/login', { email, motDePasse });
  return data;
}

export async function register(nom, email, motDePasse, secteur) {
  const { data } = await api.post('/auth/register', { nom, email, motDePasse, secteur });
  return data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch {}
}

export async function updateProfile(data) {
  const response = await api.put('/auth/profile', data);
  return response.data;
}
