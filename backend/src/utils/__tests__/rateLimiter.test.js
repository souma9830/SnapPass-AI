import { createRateLimiter } from '../../middleware/rateLimiter.middleware.js';

describe('createRateLimiter', () => {
  it('allows requests below the max limit', () => {
    const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60000 });
    const req = { ip: '192.168.1.1', headers: {}, socket: {} };
    const res = { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    limiter(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 5);
  });

  it('blocks requests exceeding the max limit', () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60000 });
    const req = { ip: '192.168.1.2', headers: {}, socket: {} };
    const res = { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    limiter(req, res, next);
    limiter(req, res, next);
    limiter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ error: 'Too many requests, please try again later.' });
  });
});
