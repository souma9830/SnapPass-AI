/**
 * rateLimiterGuard.js
 * In-memory sliding window rate limiter middleware providing protective boundaries
 * against brute-force attacks on sensitive auth and upload endpoints.
 */

const ipRequests = new Map();

export function createRateLimiterGuard({ windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests' } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, []);
    }

    const timestamps = ipRequests.get(ip).filter((time) => now - time < windowMs);
    timestamps.push(now);
    ipRequests.set(ip, timestamps);

    if (timestamps.length > max) {
      return res.status(429).json({
        success: false,
        error: 'TOO_MANY_REQUESTS',
        message,
      });
    }

    next();
  };
}

export default createRateLimiterGuard;
