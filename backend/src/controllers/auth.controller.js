import * as sessionService from '../services/session.service.js';
import * as authService from '../service/auth.service.js';
import * as passwordResetOtpService from '../service/passwordResetOtp.service.js';
import catchAsync from '../utils/catchAsync.js';
import { config } from '../config/config.js';
import { sendEmail } from '../utils/sendEmail.js';

const sendResponse = (res, statusCode, success, message, data) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export const register = catchAsync(async (req, res) => {
  const user = await authService.registerUser(req.body);
  await sessionService.createSession(res, user, req.ip, req.headers['user-agent']);
  sendResponse(res, 201, true, 'User registered successfully', {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUser(email, password);
  await sessionService.createSession(res, user, req.ip, req.headers['user-agent']);
  sendResponse(res, 200, true, 'User logged in successfully', {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  });
});

export const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  sendResponse(res, 200, true, 'User data retrieved successfully', {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  });
});

export const logout = catchAsync(async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    await sessionService.invalidateSession(token);
  }
  const isProduction = config.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 0,
    path: "/",
  });
  sendResponse(res, 200, true, 'User logged out successfully', null);
});

export const getActiveSessions = catchAsync(async (req, res) => {
  const sessions = await sessionService.getActiveSessionsForUser(req.user.id);
  sendResponse(res, 200, true, 'Active sessions retrieved successfully', sessions);
});

export const revokeSession = catchAsync(async (req, res) => {
  const { id } = req.params;
  await sessionService.invalidateSessionById(id, req.user.id);
  sendResponse(res, 200, true, 'Session revoked successfully', null);
});

export const requestPasswordReset = catchAsync(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await authService.getUserByEmail(email);

    const otpRecord = await passwordResetOtpService.generateAndStoreOtp(
      user._id
    );

    const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                <div style="text-align: center; padding-bottom: 20px;">
                    <h2 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">SnapPass AI</h2>
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h3 style="color: #1f2937; margin-top: 0; font-size: 20px;">Password Reset</h3>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">We received a request to reset the password for your SnapPass AI account. Use the following One-Time Password (OTP) to proceed:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827; background-color: #f3f4f6; padding: 15px 25px; border-radius: 8px; border: 1px solid #e5e7eb;">
                            ${otpRecord.otp}
                        </span>
                    </div>
                    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">This code is valid for <strong>5 minutes</strong>. If you did not request a password reset, please safely ignore this email.</p>
                </div>
                <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 13px;">
                    <p>&copy; ${new Date().getFullYear()} SnapPass AI. All rights reserved.</p>
                </div>
            </div>
        `;

    await sendEmail(email, 'Password Reset OTP', emailHtml);
  } catch (error) {
    // If the error is simply that the user wasn't found, we silently ignore it
    // to prevent email enumeration. Otherwise, we rethrow the internal error.
    if (error.statusCode !== 404 && error.name !== 'NotFoundError') {
      throw error;
    }
  }

  // Always return success to not leak account existence
  sendResponse(
    res,
    200,
    true,
    'If an account with that email exists, an OTP has been sent.',
    null
  );
});

export const verifyPasswordResetOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  // Return a generic response to prevent email enumeration.
  // Do not let OTP validity / email existence differences leak via response.
  const genericSuccessMessage =
    'If the provided information is valid, verification succeeded.';

  try {
    const user = await authService.getUserByEmail(email);
    // Validate OTP (may throw). Intentionally swallow any errors to keep response indistinguishable.
    await passwordResetOtpService.checkOtpValidity(user._id, otp);
  } catch (error) {
    // Intentionally ignore all errors (user not found, invalid/expired OTP, too many attempts, etc.)
    // to avoid leaking account existence or OTP validity.
  }

  sendResponse(res, 200, true, genericSuccessMessage, null);
});

export const resetPassword = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  let user;
  try {
    user = await authService.getUserByEmail(email);
  } catch (error) {
    // If user not found, return generic success to prevent email enumeration
    if (error.statusCode === 404 || error.name === 'NotFoundError') {
      return sendResponse(res, 200, true, 'Password reset successfully', null);
    }
    throw error;
  }
  // Verify OTP
  await passwordResetOtpService.verifyOtp(user._id, otp);
  // Update Password
  await authService.updatePassword(user._id, newPassword);
  sendResponse(res, 200, true, 'Password reset successfully', null);
});
