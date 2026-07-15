import axios from 'axios';
import { logApiError } from '../utils/errorTracker';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

if (!apiBaseUrl && import.meta.env.DEV) {
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
  (error) => {
    logApiError(error);
    // Pass the original error through so the caller can read error.response.status etc.
    return Promise.reject(error);
  }
);

export default api;
