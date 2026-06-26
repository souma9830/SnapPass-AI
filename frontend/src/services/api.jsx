/**
 * api.js — Axios instance pre-configured for the SnapPass AI backend.
 *
 * Import this in service files instead of raw fetch/axios calls.
 *
 * Requires the VITE_API_URL environment variable to be set.
 * In development: create frontend/.env and set VITE_API_URL=http://localhost:5005/api
 * In production:  set VITE_API_URL to your deployed backend URL in your hosting dashboard.
 */

import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:5005/api' : '/api');

if (!apiBaseUrl && import.meta.env.DEV) {
  console.warn(
    '[SnapPass] VITE_API_URL is not set. ' +
    'Copy frontend/.env.example to frontend/.env and fill in the backend URL.'
  );
}

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000, // 60s — AI processing can take time
  headers: {
    Accept: 'application/json',
  },
});

// ── Request interceptor (add auth token in the future) ─────────────────────
api.interceptors.request.use(
  (config) => {
    // TODO: attach JWT if admin auth is added
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

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
