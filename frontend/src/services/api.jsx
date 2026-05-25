/**
 * api.js — Axios instance pre-configured for the SnapPass AI backend.
 *
 * Import this in service files instead of raw fetch/axios calls.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60s — AI processing can take time
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

// ── Response interceptor (global error normalisation) ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export default api;
