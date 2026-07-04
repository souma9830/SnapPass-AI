import { Router } from "express";
import { loginValidation, registerValidation, passwordResetRequestValidation, verifyPasswordResetOtpValidation, passwordResetValidation } from "../validation/auth.validation.js";
import validate from "../middleware/validate.middleware.js";
import * as authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { otpActionLimiter, authLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", authLimiter, registerValidation, validate, authController.register);

/**
 * @route POST /api/auth/login
 * @description Login a user and return a JWT token in an HTTP-only cookie
 * @access Public
 */
router.post("/login", authLimiter, loginValidation, validate, authController.login);

/**
 * @route POST /api/auth/logout
 * @description Logout a user and invalidate the JWT token
 * @access Private
 */
router.post("/logout", authMiddleware, authController.logout);

/**
 * @route GET /api/auth/me
 * @description Get the currently logged-in user's data
 * @access Private
 */
router.get("/me", authMiddleware, authController.getMe);

/**
 * @route GET /api/auth/sessions
 * @description List all active audited sessions for the current user
 * @access Private
 */
router.get("/sessions", authMiddleware, authController.getActiveSessions);

/**
 * @route DELETE /api/auth/sessions/:id
 * @description Revoke a specific user session by database ID
 * @access Private
 */
router.post("/sessions/bulk-revoke", authMiddleware, authController.bulkRevokeSessions);
router.delete("/sessions/:id", authMiddleware, authController.revokeSession);

/**
 * @route POST /api/auth/password-reset-request
 * @description Request an OTP for password reset
 * @access Public
 */
router.post("/password-reset-request", otpActionLimiter, passwordResetRequestValidation, validate, authController.requestPasswordReset);

/**
 * @route POST /api/auth/verify-otp
 * @description Verify the OTP before resetting the password
 * @access Public
 */
router.post("/verify-otp", otpActionLimiter, verifyPasswordResetOtpValidation, validate, authController.verifyPasswordResetOtp);

/**
 * @route POST /api/auth/password-reset
 * @description Reset password using OTP
 * @access Public
 */
router.post("/password-reset", otpActionLimiter, passwordResetValidation, validate, authController.resetPassword);

export default router;