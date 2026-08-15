/**
 * healthDiagnostics.service.js — Advanced Microservice Health Diagnostics & Circuit Breaker
 * Built for ELUSoC 2026 / GSSOC 2026 Monitoring Infrastructure.
 */
import os from 'os';
import mongoose from 'mongoose';
import axios from 'axios';
import { config } from '../config/config.js';
import { isRedisAvailable } from '../config/redis.js';

export class HealthDiagnosticsService {
  static getSystemMetrics() {
    return {
      uptimeSeconds: process.uptime(),
      memory: {
        totalBytes: os.totalmem(),
        freeBytes: os.freemem(),
        heapUsedBytes: process.memoryUsage().heapUsed,
        heapTotalBytes: process.memoryUsage().heapTotal,
      },
      cpu: {
        loadAvg: os.loadavg(),
        cpusCount: os.cpus().length,
      },
    };
  }

  static async computeEventLoopLag() {
    const start = Date.now();
    await new Promise((resolve) => setImmediate(resolve));
    return Date.now() - start;
  }

  static async getFullDiagnostics() {
    const eventLoopLagMs = await this.computeEventLoopLag();
    const metrics = this.getSystemMetrics();

    const diagnostics = {
      timestamp: new Date().toISOString(),
      status: 'HEALTHY',
      eventLoopLagMs,
      metrics,
      services: {
        mongodb: 'UNKNOWN',
        redis: isRedisAvailable() ? 'CONNECTED' : 'DISCONNECTED',
        pythonAiService: 'UNKNOWN',
      },
    };

    let allHealthy = true;

    // 1. Check MongoDB
    try {
      const dbState = mongoose.connection.readyState;
      const states = { 0: 'DISCONNECTED', 1: 'CONNECTED', 2: 'CONNECTING', 3: 'DISCONNECTING' };
      diagnostics.services.mongodb = states[dbState] || 'UNKNOWN';
      if (dbState !== 1) allHealthy = false;
    } catch (err) {
      diagnostics.services.mongodb = `ERROR: ${err.message}`;
      allHealthy = false;
    }

    // 2. Check Python AI Service Health
    try {
      const aiUrl = config.aiServiceUrl || 'http://localhost:8000';
      const response = await axios.get(`${aiUrl}/health`, { timeout: 3000 });
      if (response.status === 200) {
        diagnostics.services.pythonAiService = 'HEALTHY';
      } else {
        diagnostics.services.pythonAiService = `DEGRADED (${response.status})`;
        allHealthy = false;
      }
    } catch (err) {
      diagnostics.services.pythonAiService = `OFFLINE (${err.message})`;
      allHealthy = false;
    }

    diagnostics.status = allHealthy ? 'HEALTHY' : 'DEGRADED';
    return diagnostics;
  }
}
