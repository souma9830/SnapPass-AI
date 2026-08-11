import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { CircuitBreaker } from './circuitBreaker.js';
import circuitBreakerTelemetryService from '../services/circuitBreakerTelemetry.service.js';

const aiCircuitBreaker = new CircuitBreaker({ failureThreshold: 3, resetTimeout: 15000 });

circuitBreakerTelemetryService.attach(aiCircuitBreaker, 'python-ai-service');

/**
 * Headers every call to the Python AI service must carry. When
 * AI_SERVICE_API_KEY is set, the Flask side requires it as X-API-Key
 * (see python-ai-service/main.py, #1488).
 */
export const aiServiceAuthHeaders = () => {
  const apiKey = process.env.AI_SERVICE_API_KEY;
  return apiKey ? { 'X-API-Key': apiKey } : {};
};

export const forwardImageToAIService = async (filePath, options = {}) => {
  return aiCircuitBreaker.execute(async () => {
    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));
    Object.keys(options).forEach((key) => {
      form.append(key, options[key]);
    });

    const response = await axios.post(
      process.env.AI_SERVICE_URL || 'http://localhost:5000/process',
      form,
      {
        headers: { ...form.getHeaders(), ...aiServiceAuthHeaders() },
        timeout: parseInt(process.env.AI_SERVICE_TIMEOUT, 10) || 10000
      }
    );
    return response.data;
  });
};

export { aiCircuitBreaker };
