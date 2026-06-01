import rateLimit from "express-rate-limit";

// Rate limiting for password reset and OTP verifications 
// Limits each IP to 5 OTP attempts per 15 minutes
export const otpActionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        success: false,
        message: "Too many attempts from this IP, please try again after 15 minutes"
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});


// General rate limiting for API endpoints to protect against brute-force and scraping
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes"
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});
