import { sanitizeMiddleware } from '../middleware/sanitizeMiddleware.js';
import { securityHeadersMiddleware } from '../middleware/securityHeaders.js';
import { createRateLimiterGuard } from '../middleware/rateLimiterGuard.js';

describe('Backend Security Middleware Test Suite', () => {
  it('strips script tags and malicious NoSQL operators from request body', () => {
    const req = {
      body: {
        username: '<script>alert("xss")</script>John',
        queryFilter: { $gt: '' },
      },
    };
    const res = {};
    const next = jest.fn();

    sanitizeMiddleware(req, res, next);

    expect(req.body.username).toBe('John');
    expect(req.body.queryFilter).toEqual({});
    expect(next).toHaveBeenCalled();
  });

  it('sets OWASP security headers on response', () => {
    const req = {};
    const setHeader = jest.fn();
    const res = { setHeader };
    const next = jest.fn();

    securityHeadersMiddleware(req, res, next);

    expect(setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    expect(setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    expect(next).toHaveBeenCalled();
  });

  it('rate limiter triggers 429 when max threshold exceeded', () => {
    const limiter = createRateLimiterGuard({ windowMs: 60000, max: 2 });
    const req = { ip: '127.0.0.1', headers: {}, socket: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    limiter(req, res, next);
    limiter(req, res, next);
    limiter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'TOO_MANY_REQUESTS' })
    );
  });
});
