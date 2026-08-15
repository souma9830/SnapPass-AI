import api from './api';

export const fetchUploadHistory = async () => {
  const resp = await api.get('/upload-history');
  return resp?.data?.data || [];
};

