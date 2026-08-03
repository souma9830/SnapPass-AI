import api from './api';

export const fetchSessions = async () => {
  const { data } = await api.get('/auth/sessions');
  return data;
};

export const revokeSession = async (sessionId) => {
  const { data } = await api.delete(`/auth/sessions/${sessionId}`);
  return data;
};

export const bulkRevokeSessions = async (sessionIds) => {
  const { data } = await api.post('/auth/sessions/bulk-revoke', {
    sessionIds,
  });
  return data;
};
