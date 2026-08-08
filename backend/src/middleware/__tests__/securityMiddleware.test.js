import { deepRequestSanitizer } from '../requestSanitizer.middleware.js';
import { createRateLimiter } from '../rateLimiter.middleware.js';

describe('Security Middleware Suite', () => {
  describe('deepRequestSanitizer', () => {
    test('sanitizes script tags from request body', () => {
      const req = {
        body: {
          username: 'admin',
          comment: '<script>alert("xss")</script>hello',
        },
      };
      const res = {};
      const next = jest.fn();

      deepRequestSanitizer(req, res, next);

      expect(req.body.comment).toBe('hello');
      expect(next).toHaveBeenCalled();
    });

    test('strips NoSQL injection keys starting with $', () => {
      const req = {
        body: {
          $where: 'this.password != null',
          username: { $ne: null },
        },
      };
      const res = {};
      const next = jest.fn();

      deepRequestSanitizer(req, res, next);

      expect(req.body.$where).toBeUndefined();
      expect(req.body.username.ne).toBeUndefined();
    });

  });

  describe('rateLimiter', () => {
    test('allows requests within limit and sets rate limit headers', () => {
      const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60000 });
      const req = { ip: '192.168.1.1', headers: {} };
      const setHeaderMock = jest.fn();
      const res = { setHeader: setHeaderMock, status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      limiter(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(setHeaderMock).toHaveBeenCalledWith('X-RateLimit-Limit', 2);

      limiter(req, res, next);
      expect(next).toHaveBeenCalledTimes(2);

      limiter(req, res, next);
      expect(res.status).toHaveBeenCalledWith(429);
    });
  });
});
