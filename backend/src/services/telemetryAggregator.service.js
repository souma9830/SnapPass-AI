/**
 * telemetryAggregator.service.js — System Telemetry Log Aggregator
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export class TelemetryAggregatorService {
  static durations = [];
  static totalErrors = 0;

  static reset() {
    this.durations = [];
    this.totalErrors = 0;
  }

  static record(durationMs, statusCode) {
    this.durations.push(durationMs);
    if (statusCode >= 500) this.totalErrors += 1;
  }

  static getSummary() {
    const sorted = [...this.durations].sort((a, b) => a - b);
    const totalRequests = sorted.length;
    const avgMs = totalRequests
      ? sorted.reduce((total, duration) => total + duration, 0) / totalRequests
      : 0;
    const p95Index = totalRequests ? Math.min(totalRequests - 1, Math.ceil(totalRequests * 0.95) - 1) : 0;
    return {
      totalRequests,
      totalErrors: this.totalErrors,
      avgMs,
      p95Ms: totalRequests ? sorted[p95Index] : 0,
    };
  }
}

export const telemetryAggregator = TelemetryAggregatorService;
