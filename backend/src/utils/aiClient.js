import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { CircuitBreaker } from './circuitBreaker.js';

const aiCircuitBreaker = new CircuitBreaker({ failureThreshold: 3, resetTimeout: 15000 });

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
        headers: form.getHeaders(),
        timeout: parseInt(process.env.AI_SERVICE_TIMEOUT, 10) || 10000
      }
    );
    return response.data;
  });
};

export { aiCircuitBreaker };
