import api from './api';

/**
 * Creates an expiring share link for a sensitive photo.
 */
export const createShareLink = async ({
  filename,
  originalName,
  expirationOption = '1h',
  expiresInMinutes,
  isOneTime = false,
  password = '',
  title = '',
}) => {
  const response = await api.post('/share/create', {
    filename,
    originalName,
    expirationOption,
    expiresInMinutes,
    isOneTime,
    password,
    title,
  });
  return response.data;
};

/**
 * Retrieves public metadata for a shared link.
 */
export const getShareMeta = async (shareId) => {
  const response = await api.get(`/share/${shareId}/meta`);
  return response.data;
};

/**
 * Accesses and unlocks the shared image payload.
 */
export const accessShareLink = async (shareId, password = '') => {
  const response = await api.post(`/share/${shareId}/access`, { password });
  return response.data;
};

/**
 * Revokes an active share link manually.
 */
export const revokeShareLink = async (shareId) => {
  const response = await api.delete(`/share/${shareId}`);
  return response.data;
};
