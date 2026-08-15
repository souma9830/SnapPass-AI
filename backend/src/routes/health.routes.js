import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import { config } from '../config/config.js';
import { isRedisAvailable } from '../config/redis.js';
import { HealthCheckService } from '../services/healthCheck.service.js';
import { HealthDiagnosticsService } from '../services/healthDiagnostics.service.js';
import { formatHealthResponse } from '../utils/healthResponse.formatter.js';
import { formatDiagnosticsError } from '../utils/dbStateFormatter.js';
import { validateHealthQuery } from '../validation/healthQuery.validation.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'SnapPass AI Backend API', timestamp: new Date().toISOString() });
});

router.get('/health', (req, res) => {
  const metrics = HealthCheckService.getSystemMetrics();
  res.json({ status: 'ok', service: 'SnapPass AI Backend', timestamp: new Date().toISOString(), metrics });
});

router.get('/health/readiness', async (req, res) => {
  const readiness = await HealthCheckService.performReadinessCheck();
  const statusCode = readiness.status === 'UP' ? 200 : 503;
  res.status(statusCode).json(readiness);
});


router.get('/diagnostics', async (req, res) => {
  try {
    const diagnostics = await HealthDiagnosticsService.getFullDiagnostics();
    const statusCode = diagnostics.status === 'HEALTHY' ? 200 : 503;
    return res.status(statusCode).json(formatHealthResponse(diagnostics.status, diagnostics.metrics, diagnostics.services));
  } catch (err) {
    return res.status(500).json(formatDiagnosticsError(err));
  }
});

export default router;
