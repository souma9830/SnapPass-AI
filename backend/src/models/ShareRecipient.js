/**
 * ShareRecipient Model
 *
 * Tracks individual recipients of a password share.
 * Each recipient has independent access control, revocation capability,
 * and access history tracking.
 */

const mongoose = require('mongoose');

const ShareRecipientSchema = new mongoose.Schema(
  {
    shareId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PasswordShare',
      required: true,
      index: true,
    },
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    accessToken: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'accessed', 'revoked'],
      default: 'pending',
    },
    accessCount: {
      type: Number,
      default: 0,
    },
    maxAccessCount: {
      type: Number,
      default: null,
    },
    firstAccessedAt: {
      type: Date,
      default: null,
    },
    lastAccessedAt: {
      type: Date,
      default: null,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    revokeReason: {
      type: String,
      maxlength: 300,
    },
    accessHistory: [{
      accessedAt: Date,
      ipAddress: String,
      userAgent: String,
    }],
    notificationsSent: {
      type: Number,
      default: 0,
    },
    lastNotificationAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

ShareRecipientSchema.index({ shareId: 1, recipientEmail: 1 }, { unique: true });
ShareRecipientSchema.index({ shareId: 1, status: 1 });
ShareRecipientSchema.index({ accessToken: 1 });
ShareRecipientSchema.index({ lastAccessedAt: -1 });

const ShareRecipient = mongoose.model('ShareRecipient', ShareRecipientSchema);

module.exports = ShareRecipient;
