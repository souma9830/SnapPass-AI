/**
 * rateLimiter.middleware.js — Adaptive sliding window rate limit middleware
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { rateLimitStore } from '../services/rateLimitStore.service.js';

export function rateLimiterMiddleware(req, res, next) {
  const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const result = rateLimitStore.isRateLimited(clientIp);

  res.setHeader('X-RateLimit-Limit', rateLimitStore.maxRequests);
  res.setHeader('X-RateLimit-Remaining', result.remaining);
  res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetMs / 1000));

  if (result.limited) {
    return res.status(429).json({
      success: false,
      error: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfterSeconds: Math.ceil(result.resetMs / 1000),
    });
  }

  next();
}
