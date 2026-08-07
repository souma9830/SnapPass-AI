import { calculateSlidingWeight } from '../utils/slidingWindow.utils.js';

const requestCounts = new Map();
const blockedIPs = new Map();

export const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const maxRequests = options.maxRequests || 100;
  const blockDurationMs = options.blockDurationMs || 30 * 60 * 1000; // 30 mins
  const message = options.message || { error: 'Too many requests, please try again later.' };

  return (req, res, next) => {
    const rawIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const clientKey = `${rawIp}:${req.headers['user-agent'] || 'unknown'}`;
    const now = Date.now();

    // Track the IP-level bucket so blocked clients stay blocked even when
    // they rotate their User-Agent header between requests.
    if (!requestCounts.has(rawIp)) {
      requestCounts.set(rawIp, []);
    }

    if (!requestCounts.has(clientKey)) {
      requestCounts.set(clientKey, []);
    }

    const timestamps = requestCounts.get(clientKey).filter((ts) => now - ts < windowMs);
    timestamps.push(now);
    requestCounts.set(clientKey, timestamps);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - timestamps.length));
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

    if (timestamps.length > maxRequests) {
      if (timestamps.length > maxRequests * 2) {
        blockedIPs.set(rawIp, now + blockDurationMs);
      }
      return res.status(429).json(message);
    }

    next();
  };
};

export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  blockDurationMs: 15 * 60 * 1000,
  message: { error: 'Too many authentication attempts. Please wait 15 minutes.' }
});

export default apiRateLimiter;
