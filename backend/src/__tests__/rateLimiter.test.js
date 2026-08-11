/**
 * rateLimiter.test.js — Rate Limiter Middleware Unit Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { RateLimitStoreService } from '../services/rateLimitStore.service.js';

describe('RateLimitStoreService Tests', () => {
  it('should allow requests within max limit', () => {
    const store = new RateLimitStoreService(60000, 3);
    expect(store.isRateLimited('1.2.3.4').limited).toBe(false);
    expect(store.isRateLimited('1.2.3.4').limited).toBe(false);
    expect(store.isRateLimited('1.2.3.4').limited).toBe(false);
  });

  it('should block requests exceeding max limit', () => {
    const store = new RateLimitStoreService(60000, 2);
    store.isRateLimited('5.6.7.8');
    store.isRateLimited('5.6.7.8');
    const result = store.isRateLimited('5.6.7.8');
    expect(result.limited).toBe(true);
    expect(result.remaining).toBe(0);
  });
});
