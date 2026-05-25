import api from './api';

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return data.data;
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
}

export async function logout() {
  await api.post('/auth/logout');
}
