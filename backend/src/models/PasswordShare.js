/**
 * PasswordShare Model
 *
 * Represents a password share that can be shared with multiple recipients.
 * Each share has a unique identifier, encrypted content, and expiration policy.
 */

const mongoose = require('mongoose');

const PasswordShareSchema = new mongoose.Schema(
  {
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    maxAccessCount: {
      type: Number,
      default: null,
    },
    totalAccessCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    accessedAt: {
      type: Date,
      default: null,
    },
    ipAddresses: [{
      type: String,
    }],
    status: {
      type: String,
      enum: ['active', 'expired', 'revoked', 'accessed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

PasswordShareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
PasswordShareSchema.index({ ownerId: 1, createdAt: -1 });

const PasswordShare = mongoose.model('PasswordShare', PasswordShareSchema);

module.exports = PasswordShare;
