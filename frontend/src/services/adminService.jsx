import api from './api';

export async function getStats() {
  const { data } = await api.get('/admin/stats');
  return data.data;
}

export async function getUploads(params = {}) {
  const { data } = await api.get('/admin/uploads', { params });
  return data.data;
}

export async function getSettings() {
  const { data } = await api.get('/admin/settings');
  return data.data;
}

export async function updateSettings(settingsData) {
  const { data } = await api.put('/admin/settings', settingsData);
  return data.data;
}

export async function deleteUpload(id) {
  const { data } = await api.delete(`/admin/uploads/${id}`);
  return data.data;
}

export async function getUsers(params = {}) {
  const { data } = await api.get('/admin/users', { params });
  return data.data;
}

