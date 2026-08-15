/**
 * rateLimiter.middleware.js — Adaptive sliding window rate limit middleware
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { rateLimitStore } from '../services/rateLimitStore.service.js';

export function createRateLimiter({ maxRequests = 100, windowMs = 60000 } = {}) {
  const hits = new Map();

  return (req, res, next) => {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const timestamps = (hits.get(clientIp) || []).filter((timestamp) => now - timestamp < windowMs);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - timestamps.length - 1));
    res.setHeader('X-RateLimit-Reset', Math.ceil(windowMs / 1000));

    if (timestamps.length >= maxRequests) {
      hits.set(clientIp, timestamps);
      return res.status(429).json({ error: 'Too many requests, please try again later.' });
    }

    timestamps.push(now);
    hits.set(clientIp, timestamps);
    return next();
  };
}

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

export const apiRateLimiter = rateLimiterMiddleware;
