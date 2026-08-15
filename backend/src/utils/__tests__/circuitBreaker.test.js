import { CircuitBreaker } from '../circuitBreaker.js';

describe('CircuitBreaker Utility', () => {
  test('starts in CLOSED state', () => {
    const cb = new CircuitBreaker();
    expect(cb.getStatus().state).toBe('CLOSED');
  });

  test('trips to OPEN state after max failures', async () => {
    const cb = new CircuitBreaker({ failureThreshold: 2, resetTimeout: 1000 });
    const failingFn = jest.fn().mockRejectedValue(new Error('Backend error'));

    await expect(cb.execute(failingFn)).rejects.toThrow();
    await expect(cb.execute(failingFn)).rejects.toThrow();

    expect(cb.getStatus().state).toBe('OPEN');
    await expect(cb.execute(failingFn)).rejects.toThrow(/CircuitBreakerOpen/);
  });
});
