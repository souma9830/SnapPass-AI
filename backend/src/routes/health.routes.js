import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import { config } from '../config/config.js';

const router = express.Router();

router.get('/diagnostics', async (req, res) => {
  const diagnostics = {
    timestamp: new Date(),
    uptime: process.uptime(),
    services: {
      mongodb: 'unknown',
      pythonService: 'unknown'
    }
  };

  // 1. MongoDB Check
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    diagnostics.services.mongodb = states[dbState] || 'unknown';
  } catch (err) {
    diagnostics.services.mongodb = 'error: ' + err.message;
  }

  // 2. Python AI Service Check
  try {
    const pythonUrl = config.aiServiceUrl || 'http://localhost:8000';
    const response = await axios.get(`${pythonUrl}/health`, { timeout: 3000 });
    if (response.status === 200) {
      diagnostics.services.pythonService = 'healthy';
    } else {
      diagnostics.services.pythonService = `unhealthy (status: ${response.status})`;
    }
  } catch (err) {
    diagnostics.services.pythonService = 'offline/error: ' + err.message;
  }

  const isAllHealthy =
    diagnostics.services.mongodb === 'connected' &&
    diagnostics.services.pythonService === 'healthy';

  return res.status(isAllHealthy ? 200 : 200).json({
    status: isAllHealthy ? 'healthy' : 'degraded',
    ...diagnostics
  });
});

export default router;
