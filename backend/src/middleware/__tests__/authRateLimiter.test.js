import { authRateLimiter } from '../authRateLimiter.middleware.js';

describe('Auth Rate Limiter Middleware', () => {
  it('exports valid rate limiter middleware instance', () => {
    expect(authRateLimiter).toBeDefined();
    expect(typeof authRateLimiter).toBe('function');
  });
});
