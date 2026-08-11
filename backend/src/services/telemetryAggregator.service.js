/**
 * telemetryAggregator.service.js — System Telemetry Log Aggregator
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export class TelemetryAggregatorService {
  constructor() {
    this.events = [];
  }

  recordEvent(type, payload = {}) {
    this.events.push({
      type,
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  getSummary() {
    return {
      totalEvents: this.events.length,
      latest: this.events.slice(-5),
    };
  }
}

export const telemetryAggregator = new TelemetryAggregatorService();
