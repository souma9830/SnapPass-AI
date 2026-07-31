/**
 * AI microservice HTTP client.
 *
 * Pre-configured axios instance for calls to the Python Flask AI service.
 * Automatically attaches the X-Internal-Secret header (when configured) so
 * the AI service can authenticate requests originating from the Express
 * backend, preventing direct external access to the AI endpoints.
 */

import axios from 'axios';
import { config } from '../config/config.js';

const aiClient = axios.create({
  baseURL: config.aiServiceUrl,
  timeout: 60000,
});

aiClient.interceptors.request.use((requestConfig) => {
  if (config.INTERNAL_API_SECRET) {
    requestConfig.headers = requestConfig.headers || {};
    requestConfig.headers['X-Internal-Secret'] = config.INTERNAL_API_SECRET;
  }
  return requestConfig;
});

export default aiClient;
