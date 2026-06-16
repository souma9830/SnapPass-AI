import rateLimit from "express-rate-limit";

// Rate limiting for password reset and OTP verifications 
// Limits each IP to 5 OTP attempts per 15 minutes
export const otpActionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        success: false,
        message: "Too many attempts from this IP, please try again after 15 minutes",
        errorType: "OTP_RATE_LIMIT_EXCEEDED",
        retryAfterSeconds: 900
    },
    standardHeaders: 'draft-7', 
    legacyHeaders: false, 
});

// General rate limiting for API endpoints to protect against brute-force and scraping
// Dynamic rate limits configuration
export const dynamicRateLimiter = (limit, minutes) => {
  return (req, res, next) => next();
};

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
        errorType: "API_RATE_LIMIT_EXCEEDED",
        retryAfterSeconds: 900
    },
    standardHeaders: 'draft-7', 
    legacyHeaders: false, 
});

// Strict rate limit for authentication (login/register) to prevent brute-forcing
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 attempts
    message: {
        success: false,
        message: "Too many login or registration attempts. Please try again after 15 minutes.",
        errorType: "AUTH_RATE_LIMIT_EXCEEDED",
        retryAfterSeconds: 900
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

// Limit review submissions to reduce spam and rating manipulation
export const testimonialSubmissionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many review submissions from this IP. Please try again later.",
        errorType: "TESTIMONIAL_RATE_LIMIT_EXCEEDED",
        retryAfterSeconds: 3600
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

