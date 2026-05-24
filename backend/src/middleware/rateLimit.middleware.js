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
