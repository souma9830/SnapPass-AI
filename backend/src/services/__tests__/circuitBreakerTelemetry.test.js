import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.mock('../../models/circuitBreakerMetric.model.js', () => ({
  __esModule: true,
  default: {
    create: jest.fn().mockResolvedValue({}),
    find: jest.fn(() => ({
      sort: jest.fn(() => ({
        limit: jest.fn(() => ({
          lean: jest.fn().mockResolvedValue([]),
        })),
      })),
    })),
    aggregate: jest.fn().mockResolvedValue([
      {
        _id: null,
        totalEvents: 4,
        successes: 2,
        failures: 1,
        opens: 1,
        halfOpens: 0,
        lastEventAt: new Date(),
      },
    ]),
  },
}));

import CircuitBreakerMetric from '../../models/circuitBreakerMetric.model.js';
import { CircuitBreakerTelemetryService } from '../../services/circuitBreakerTelemetry.service.js';
import { CircuitBreaker } from '../../utils/circuitBreaker.js';

describe('CircuitBreakerTelemetryService', () => {
  let service;
  let breaker;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CircuitBreakerTelemetryService();
    breaker = new CircuitBreaker({ failureThreshold: 2, resetTimeout: 1000 });
  });

  it('persists a success metric when the breaker succeeds', async () => {
    service.attach(breaker, 'test-service');
    await breaker.execute(async () => 'ok');

    expect(CircuitBreakerMetric.create).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'success', service: 'test-service' })
    );
  });

  it('persists failure and open metrics on repeated failures', async () => {
    service.attach(breaker, 'test-service');
    const failing = async () => {
      throw new Error('boom');
    };

    await breaker.execute(failing).catch(() => {});
    await breaker.execute(failing).catch(() => {});

    expect(CircuitBreakerMetric.create).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'failure', errorMessage: 'boom' })
    );
    expect(CircuitBreakerMetric.create).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'open', state: 'OPEN' })
    );
  });

  it('returns aggregated statistics with a failure rate', async () => {
    const agg = await service.getAggregate('test-service');

    expect(CircuitBreakerMetric.aggregate).toHaveBeenCalled();
    expect(agg.failureRate).toBeCloseTo(25);
    expect(agg.totalEvents).toBe(4);
  });

  it('does not attach the same breaker twice', async () => {
    service.attach(breaker);
    service.attach(breaker);

    await breaker.execute(async () => 'ok');
    expect(CircuitBreakerMetric.create).toHaveBeenCalledTimes(1);
  });
});