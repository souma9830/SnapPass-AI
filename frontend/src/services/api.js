import axios from 'axios';
import { logApiError } from '../utils/errorTracker';
import { getInitialBaseUrl } from './portSync';

const apiBaseUrl = getInitialBaseUrl();

if (!apiBaseUrl && import.meta?.env?.DEV) {
  console.warn(
    '[SnapPass] VITE_API_URL is not set. ' +
    'Copy frontend/.env.example to frontend/.env and fill in the backend URL.'
  );
}

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    logApiError(error);
    const originalRequest = error.config;
    if (originalRequest && !originalRequest._retried && (!error.response || error.code === 'ERR_NETWORK')) {
      originalRequest._retried = true;
      try {
        const { scanBackendPorts } = await import('./portSync');
        const activePort = await scanBackendPorts();
        if (activePort) {
          originalRequest.baseURL = `http://localhost:${activePort}/api`;
          return api(originalRequest);
        }
      } catch (scanErr) {
        console.error('[SnapPass API] Auto-retry scan failed:', scanErr);
      }
    }
    // Pass the original error through so the caller can read error.response.status etc.
    return Promise.reject(error);
  }
);

export const checkFacialAsymmetry = async (filePath) => {
  const response = await api.post('/compliance/asymmetry', { file_path: filePath });
  return response.data;
};

export default api;
