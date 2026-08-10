/**
 * Circuit Breaker & Adaptive Sliding Window Telemetry Service.
 * Tracks microservice health, failopen states, and rate limit quotas.
 */

class CircuitBreakerTelemetryService {
  constructor() {
    this.services = new Map();
  }

  registerStateChange(serviceName, state, latencyMs, error = null) {
    const current = this.services.get(serviceName) || {
      state: 'CLOSED',
      totalRequests: 0,
      failedRequests: 0,
      lastLatencyMs: 0,
      lastStateChange: new Date().toISOString()
    };

    current.totalRequests += 1;
    current.lastLatencyMs = latencyMs;

    if (error || state === 'OPEN') {
      current.failedRequests += 1;
    }

    if (current.state !== state) {
      current.state = state;
      current.lastStateChange = new Date().toISOString();
    }

    this.services.set(serviceName, current);
    return current;
  }

  getMetrics(serviceName) {
    if (serviceName) {
      return this.services.get(serviceName) || null;
    }
    const result = {};
    for (const [key, val] of this.services.entries()) {
      result[key] = val;
    }
    return result;
  }
}

module.exports = new CircuitBreakerTelemetryService();
