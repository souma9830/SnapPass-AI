import CircuitBreakerMetric from '../models/circuitBreakerMetric.model.js';

/**
 * CircuitBreakerTelemetryService — captures state-transition events from
 * CircuitBreaker instances (success/failure/open/half-open) and persists
 * them for real-time monitoring of microservice health (#1975).
 */
export class CircuitBreakerTelemetryService {
  constructor() {
    this.attached = new Set();
    this.inMemoryCounters = {
      successes: 0,
      failures: 0,
      opens: 0,
    };
  }

  attach(breaker, serviceName = 'python-ai-service') {
    if (!breaker || this.attached.has(breaker)) return;
    this.attached.add(breaker);

    const record = (event, extra = {}) => {
      const status = breaker.getStatus ? breaker.getStatus() : {};
      this.inMemoryCounters[event] = (this.inMemoryCounters[event] || 0) + 1;

      CircuitBreakerMetric.create({
        service: serviceName,
        state: status.state || 'CLOSED',
        event,
        failureCount: status.failureCount || 0,
        failureThreshold: breaker.failureThreshold || 5,
        resetTimeoutMs: breaker.resetTimeout || 30000,
        nextAttempt: status.nextAttempt ? new Date(status.nextAttempt) : null,
        errorMessage: (extra.error && extra.error.message) || '',
      }).catch((err) => {
        console.warn('[CircuitBreakerTelemetry] failed to persist metric:', err.message);
      });
    };

    breaker.on('success', () => record('success'));
    breaker.on('failure', (error) => record('failure', { error }));
    breaker.on('open', () => record('open'));
    breaker.on('half-open', () => record('half-open'));
  }

  async getRecentMetrics(serviceName, limit = 100) {
    return CircuitBreakerMetric.find(
      serviceName ? { service: serviceName } : {}
    )
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getAggregate(serviceName) {
    const match = serviceName ? { service: serviceName } : {};
    const [aggregate] = await CircuitBreakerMetric.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          successes: { $sum: { $cond: [{ $eq: ['$event', 'success'] }, 1, 0] } },
          failures: { $sum: { $cond: [{ $eq: ['$event', 'failure'] }, 1, 0] } },
          opens: { $sum: { $cond: [{ $eq: ['$event', 'open'] }, 1, 0] } },
          halfOpens: {
            $sum: { $cond: [{ $eq: ['$event', 'half-open'] }, 1, 0] },
          },
          lastEventAt: { $max: '$createdAt' },
        },
      },
    ]);

    const failureRate =
      aggregate && aggregate.totalEvents > 0
        ? Number(
            ((aggregate.failures / aggregate.totalEvents) * 100).toFixed(2)
          )
        : 0;

    return {
      service: serviceName || 'all',
      ...(aggregate || {
        totalEvents: 0,
        successes: 0,
        failures: 0,
        opens: 0,
        halfOpens: 0,
        lastEventAt: null,
      }),
      failureRate,
      liveCounters: { ...this.inMemoryCounters },
    };
  }
}

const circuitBreakerTelemetryService = new CircuitBreakerTelemetryService();

export default circuitBreakerTelemetryService;