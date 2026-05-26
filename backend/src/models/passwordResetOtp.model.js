import mongoose from "mongoose";

const passwordResetOtpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: ["pending", "resolve", "reject"],
      default: "pending",
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Automatically delete the document after it expires
      index: { expires: "5m" }, // Expires in 5 minutes after expiresAt
    },
  },
  {
    timestamps: true,
  }
);

const PasswordResetOtp = mongoose.model(
  "PasswordResetOtp",
  passwordResetOtpSchema
);

export default PasswordResetOtp;
