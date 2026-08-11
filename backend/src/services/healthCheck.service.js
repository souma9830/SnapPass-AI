/**
 * healthCheck.service.js — Deep health check probe service.
 */
import os from 'os';
import mongoose from 'mongoose';
import { HealthDiagnosticsService } from './healthDiagnostics.service.js';

export class HealthCheckService {
  static getSystemMetrics() {
    return HealthDiagnosticsService.getSystemMetrics();
  }

  static async performReadinessCheck() {
    return await HealthDiagnosticsService.getFullDiagnostics();
  }
}

