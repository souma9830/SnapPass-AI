import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const shareLinkSchema = new mongoose.Schema(
  {
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    isOneTime: {
      type: Boolean,
      default: false,
    },
    maxViews: {
      type: Number,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: null,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

shareLinkSchema.methods.isExpired = function () {
  if (this.isRevoked) return true;
  if (this.expiresAt && new Date() > this.expiresAt) return true;
  if (this.isOneTime && this.viewCount >= 1) return true;
  if (this.maxViews !== null && this.maxViews !== undefined && this.viewCount >= this.maxViews) {
    return true;
  }
  return false;
};

shareLinkSchema.methods.verifyPassword = async function (password) {
  if (!this.passwordHash) return true;
  if (!password) return false;
  return await bcrypt.compare(password, this.passwordHash);
};

shareLinkSchema.index({ expiresAt: 1 });
shareLinkSchema.index({ isRevoked: 1 });

const ShareLink = mongoose.model('ShareLink', shareLinkSchema);

export default ShareLink;
