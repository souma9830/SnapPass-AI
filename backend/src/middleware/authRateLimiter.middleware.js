import rateLimit from 'express-rate-limit';

/**
 * Strict sliding-window rate limiter specifically for authentication endpoints
 * (login, token refresh, password resets, token revocation).
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_AUTH_REQUESTS',
      message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
    },
  },
  skipSuccessfulRequests: false,
});
