/**
 * @description Service layer for handling password reset OTP generation, storage, and verification. This module interacts with the PasswordResetOtp DAO to manage OTPs and implements the business logic for password reset functionality.
 * @use This service is used in the password reset flow to create OTPs, verify them, and update their state as needed.
 */

import bcrypt from "bcryptjs";
import { createPasswordResetOtp, findLatestPendingOtp, incrementOtpAttempts, updateOtpState } from "../dao/passwordResetOtp.dao.js";
import { generateOTP } from "../utils/generateOTP.js";
import AppError from "../utils/errors/AppError.js";

export async function generateAndStoreOtp(userId) {
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const passwordResetOtp = await createPasswordResetOtp(userId, hashedOtp);
    passwordResetOtp.otp = otp;
    return passwordResetOtp;
}

export async function checkOtpValidity(userId, otp) {
    const pendingOtpRecord = await findLatestPendingOtp(userId);
    if (!pendingOtpRecord) {
        throw new AppError("Invalid or expired OTP", 400);
    }
    
    const isMatch = await bcrypt.compare(otp, pendingOtpRecord.otp);
    if (!isMatch) {
        // Increment attempts and fail
        const updatedRecord = await incrementOtpAttempts(pendingOtpRecord._id);
        if (updatedRecord.attempts >= 5) {
            await updateOtpState(pendingOtpRecord._id, "reject");
            throw new AppError("Too many incorrect attempts, this OTP has been invalidated.", 400);
        }
        throw new AppError("Invalid or expired OTP", 400);
    }

    return pendingOtpRecord;
}

export async function verifyOtp(userId, otp) {
    // Rely on checkOtpValidity to handle attempts checking and rejection
    const validOtp = await checkOtpValidity(userId, otp);
    
    return await updateOtpState(validOtp._id, "resolve");
}