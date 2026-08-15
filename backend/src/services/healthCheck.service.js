/**
 * healthCheck.service.js — Deep health check probe service.
 */
import mongoose from 'mongoose';
import os from 'os';
import { isRedisAvailable } from '../config/redis.js';

export class HealthCheckService {
  static getSystemMetrics() {
    return { uptimeSeconds: process.uptime(), memory: process.memoryUsage(), loadAverage: os.loadavg() };
  }

  static async performReadinessCheck() {
    const checks = {
      mongodb: mongoose.connection.readyState === 1 ? 'HEALTHY' : 'UNHEALTHY',
      redis: isRedisAvailable() ? 'HEALTHY' : 'UNHEALTHY',
    };
    return {
      timestamp: new Date().toISOString(),
      status: Object.values(checks).every((status) => status === 'HEALTHY') ? 'UP' : 'DEGRADED',
      checks,
    };
  }
}
