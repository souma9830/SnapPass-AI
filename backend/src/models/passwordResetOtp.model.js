import mongoose from 'mongoose';

const passwordResetOtpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: ['pending', 'resolve', 'reject'],
      default: 'pending',
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

passwordResetOtpSchema.index({ userId: 1, state: 1 });
passwordResetOtpSchema.index({ otp: 1 });
passwordResetOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetOtp = mongoose.model(
  'PasswordResetOtp',
  passwordResetOtpSchema
);

export default PasswordResetOtp;
