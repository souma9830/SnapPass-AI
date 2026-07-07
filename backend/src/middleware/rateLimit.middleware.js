/**
 * rateLimit.middleware.js — Express rate-limiting configuration.
 *
 * Provides two limiters:
 *   apiLimiter   — general limiter applied to all /api/* routes (100 req / 15 min)
 *   uploadLimiter — stricter limiter for upload + processing routes (20 req / 15 min)
 *                   Upload operations are computationally expensive (background
 *                   removal, face detection) so we apply a tighter ceiling to
 *                   prevent resource exhaustion from a single client.
 *
 * Both limiters return a consistent JSON error shape that matches the rest of
 * the API, include a Retry-After header so clients can back off correctly, and
 * are disabled in test environments to avoid flaky integration tests.
 */

import rateLimit from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test';

/**
 * Build a standard rate-limit error handler that returns JSON matching the
 * application's error shape rather than the plain-text express-rate-limit default.
 */
const buildHandler = (windowMinutes) => (_req, res) => {
  res.status(429).json({
    success: false,
    message: `Too many requests. You have exceeded the allowed rate. Please wait ${windowMinutes} minutes before trying again.`,
    retryAfter: windowMinutes * 60,
  });
};

export const apiLimiter = rateLimit({
  skip: () => isTest,
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(15),
});

/**
 * Tighter limit for compute-heavy endpoints:
 *   POST /api/upload
 *   POST /api/process
 *   POST /api/print/generate-sheet
 */
export const uploadLimiter = rateLimit({
  skip: () => isTest,
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(15),
});

/**
 * Stricter limit for authentication routes to prevent brute-force attacks:
 *   POST /api/auth/login
 *   POST /api/auth/register
 */
export const authLimiter = rateLimit({
  skip: () => isTest,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(15),
});

/**
 * Strictest limit for OTP actions to prevent spam and cost explosion:
 *   POST /api/auth/password-reset-request
 *   POST /api/auth/verify-otp
 *   POST /api/auth/password-reset
 */
export const otpActionLimiter = rateLimit({
  skip: () => isTest,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(60),
});

/**
 * Limit for testimonial submissions to prevent spam:
 *   POST /api/testimonials
 *   PUT  /api/testimonials
 */
export const testimonialSubmissionLimiter = rateLimit({
  skip: () => isTest,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 testimonial submissions per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: buildHandler(60),
});
