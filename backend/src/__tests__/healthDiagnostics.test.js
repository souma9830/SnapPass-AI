/**
 * health.test.js — Health Check & Deep Diagnostics Service Integration Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { HealthDiagnosticsService } from '../services/healthDiagnostics.service.js';
import { formatHealthResponse } from '../utils/healthResponse.formatter.js';

describe('HealthDiagnosticsService Tests', () => {
  it('should retrieve accurate system hardware metrics', () => {
    const metrics = HealthDiagnosticsService.getSystemMetrics();
    expect(metrics).toHaveProperty('uptimeSeconds');
    expect(metrics).toHaveProperty('memory');
    expect(metrics.memory).toHaveProperty('totalBytes');
    expect(metrics.memory).toHaveProperty('freeBytes');
  });

  it('should format health responses accurately', () => {
    const response = formatHealthResponse('HEALTHY', { memory: 'ok' }, { db: 'connected' });
    expect(response.success).toBe(true);
    expect(response.status).toBe('HEALTHY');
    expect(response).toHaveProperty('timestamp');
  });

  it('should measure non-negative event loop lag', async () => {
    const lag = await HealthDiagnosticsService.computeEventLoopLag();
    expect(lag).toBeGreaterThanOrEqual(0);
  });
});
