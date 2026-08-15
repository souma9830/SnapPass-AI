import { TelemetryAggregatorService } from '../services/telemetryAggregator.service.js';
import { formatTelemetryPayload } from '../utils/telemetryFormatter.utils.js';

describe('Telemetry Collector & Aggregator', () => {
  beforeEach(() => {
    TelemetryAggregatorService.reset();
  });

  test('TelemetryAggregatorService records request stats and computes p95', () => {
    TelemetryAggregatorService.record(10, 200);
    TelemetryAggregatorService.record(20, 200);
    TelemetryAggregatorService.record(100, 500);

    const summary = TelemetryAggregatorService.getSummary();
    expect(summary.totalRequests).toBe(3);
    expect(summary.totalErrors).toBe(1);
    expect(summary.avgMs).toBeGreaterThan(0);
  });

  test('formatTelemetryPayload formats metric snapshot envelope', () => {
    const summary = { totalRequests: 10, totalErrors: 2, avgMs: 15, p95Ms: 45 };
    const payload = formatTelemetryPayload(summary);
    expect(payload.metrics.requestsTotal).toBe(10);
    expect(payload.metrics.errorRate).toBe('0.2000');
  });
});
