/**
 * @description Data Access Object (DAO) for managing password reset OTPs in the database. This module provides functions to create and manage OTPs associated with user accounts for password reset functionality.
 * @use This module interacts with the PasswordResetOtp model to perform database operations related to OTP creation and management.
 */
import PasswordResetOtp from "../models/passwordResetOtp.model.js";

export async function createPasswordResetOtp(userId, otp) {
    const passwordResetOtp = await PasswordResetOtp.create({
        userId,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
    });
    return passwordResetOtp;
}

export async function findLatestPendingOtp(userId) {
    return await PasswordResetOtp.findOne({
        userId,
        state: "pending",
        expiresAt: { $gt: new Date() }, // OTP must not be expired
    }).sort({ createdAt: -1 });
}

export async function incrementOtpAttempts(id) {
    return await PasswordResetOtp.findByIdAndUpdate(
        id, 
        { $inc: { attempts: 1 } }, 
        { returnDocument: "after" }
    );
}

export async function updateOtpState(id, newState) {
    return await PasswordResetOtp.findByIdAndUpdate(id, { state: newState }, { returnDocument: "after" });
}