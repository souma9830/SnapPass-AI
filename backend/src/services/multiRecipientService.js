/**
 * Multi-Recipient Share Service
 *
 * Handles complex operations for sharing passwords with multiple recipients
 * including individual revocation, access tracking, and recipient management.
 */

const PasswordShare = require('../models/PasswordShare');
const ShareRecipient = require('../models/ShareRecipient');
const crypto = require('crypto');

class MultiRecipientService {
  /**
   * Create a new password share for multiple recipients
   * @param {object} options - Configuration options
   * @param {string} options.encryptedPassword - Encrypted password content
   * @param {number} options.expirationMinutes - Minutes until share expires
   * @param {number} options.maxAccessCount - Max total accesses across all recipients
   * @param {string} options.description - Share description/label
   * @param {string} options.ownerId - Owner user ID
   * @param {array} options.recipients - Array of recipient email addresses
   * @returns {object} - Created share with recipient data
   */
  static async createMultiRecipientShare(options) {
    const {
      encryptedPassword,
      expirationMinutes,
      maxAccessCount,
      description,
      ownerId,
      recipients = [],
    } = options;

    if (!recipients || recipients.length === 0) {
      throw new Error('At least one recipient is required');
    }

    if (recipients.length > 100) {
      throw new Error('Maximum 100 recipients per share');
    }

    const shareId = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + expirationMinutes * 60000);

    const share = await PasswordShare.create({
      shareId,
      ownerId,
      encryptedPassword,
      expiresAt,
      maxAccessCount: maxAccessCount || null,
      description,
    });

    const recipientDocs = recipients.map(email => ({
      shareId: share._id,
      recipientEmail: email.toLowerCase(),
      accessToken: crypto.randomBytes(32).toString('hex'),
    }));

    const createdRecipients = await ShareRecipient.insertMany(recipientDocs);

    return {
      share: share.toObject(),
      recipients: createdRecipients.map(r => ({
        email: r.recipientEmail,
        status: r.status,
        accessToken: r.accessToken,
        createdAt: r.createdAt,
      })),
      totalRecipients: recipients.length,
    };
  }

  /**
   * Add recipients to an existing share
   * @param {string} shareId - Share MongoDB ID
   * @param {array} newRecipients - New recipient email addresses
   * @param {string} addedBy - User ID adding recipients
   * @returns {object} - Updated recipient list
   */
  static async addRecipients(shareId, newRecipients, addedBy) {
    const share = await PasswordShare.findById(shareId);
    if (!share) throw new Error('Share not found');

    if (share.status === 'revoked' || share.expiresAt < new Date()) {
      throw new Error('Cannot add recipients to expired or revoked share');
    }

    const existingCount = await ShareRecipient.countDocuments({ shareId });
    if (existingCount + newRecipients.length > 100) {
      throw new Error('Adding these recipients would exceed limit of 100');
    }

    const recipientDocs = newRecipients.map(email => ({
      shareId,
      recipientEmail: email.toLowerCase(),
      accessToken: crypto.randomBytes(32).toString('hex'),
    }));

    const created = await ShareRecipient.insertMany(recipientDocs);

    return {
      addedCount: created.length,
      recipients: created.map(r => ({
        email: r.recipientEmail,
        accessToken: r.accessToken,
      })),
    };
  }

  /**
   * Revoke access for a specific recipient
   * @param {string} shareId - Share ID
   * @param {string} recipientEmail - Recipient email to revoke
   * @param {string} revokedBy - User ID performing revocation
   * @param {string} revokeReason - Reason for revocation
   * @returns {object} - Revocation details
   */
  static async revokeRecipient(shareId, recipientEmail, revokedBy, revokeReason) {
    const recipient = await ShareRecipient.findOneAndUpdate(
      {
        shareId: shareId,
        recipientEmail: recipientEmail.toLowerCase(),
      },
      {
        status: 'revoked',
        revokedAt: new Date(),
        revokedBy,
        revokeReason,
      },
      { new: true }
    );

    if (!recipient) {
      throw new Error('Recipient not found for this share');
    }

    return {
      email: recipient.recipientEmail,
      revokedAt: recipient.revokedAt,
      previousStatus: recipient.status,
    };
  }

  /**
   * Revoke access for all recipients (revoke entire share)
   * @param {string} shareId - Share MongoDB ID
   * @param {string} revokedBy - User ID performing revocation
   * @param {string} revokeReason - Reason for revocation
   * @returns {object} - Revocation statistics
   */
  static async revokeAllRecipients(shareId, revokedBy, revokeReason) {
    const share = await PasswordShare.findById(shareId);
    if (!share) throw new Error('Share not found');

    const result = await ShareRecipient.updateMany(
      { shareId, status: { $ne: 'revoked' } },
      {
        status: 'revoked',
        revokedAt: new Date(),
        revokedBy,
        revokeReason,
      }
    );

    await PasswordShare.findByIdAndUpdate(shareId, { status: 'revoked' });

    return {
      revokedCount: result.modifiedCount,
      shareId: share.shareId,
      revokedAt: new Date(),
    };
  }

  /**
   * Record access to a password share by a recipient
   * @param {string} accessToken - Recipient's access token
   * @param {string} ipAddress - Accessor's IP address
   * @param {string} userAgent - Accessor's user agent
   * @returns {object} - Access status and share data
   */
  static async recordAccess(accessToken, ipAddress, userAgent) {
    const recipient = await ShareRecipient.findOne({ accessToken });
    if (!recipient) {
      throw new Error('Invalid access token');
    }

    if (recipient.status === 'revoked') {
      throw new Error('This share has been revoked');
    }

    const share = await PasswordShare.findById(recipient.shareId);
    if (!share) throw new Error('Share not found');

    if (share.expiresAt < new Date()) {
      throw new Error('This share has expired');
    }

    if (recipient.maxAccessCount && recipient.accessCount >= recipient.maxAccessCount) {
      throw new Error('Recipient access limit reached');
    }

    if (share.maxAccessCount && share.totalAccessCount >= share.maxAccessCount) {
      throw new Error('Share access limit reached');
    }

    const accessRecord = {
      accessedAt: new Date(),
      ipAddress,
      userAgent,
    };

    await ShareRecipient.findByIdAndUpdate(recipient._id, {
      $inc: { accessCount: 1 },
      $push: { accessHistory: accessRecord },
      $set: {
        lastAccessedAt: new Date(),
        ...(recipient.status === 'pending' && { status: 'accessed' }),
        ...(recipient.firstAccessedAt === null && { firstAccessedAt: new Date() }),
      },
    });

    await PasswordShare.findByIdAndUpdate(share._id, {
      $inc: { totalAccessCount: 1 },
      $set: {
        accessedAt: new Date(),
        ...(share.status === 'active' && { status: 'accessed' }),
      },
      $addToSet: { ipAddresses: ipAddress },
    });

    return {
      shareId: share.shareId,
      accessedAt: new Date(),
      remainingAccess: recipient.maxAccessCount
        ? recipient.maxAccessCount - recipient.accessCount - 1
        : null,
    };
  }

  /**
   * Get share details with recipient list and access history
   * @param {string} shareId - Share MongoDB ID
   * @returns {object} - Complete share information
   */
  static async getShareDetails(shareId) {
    const share = await PasswordShare.findById(shareId);
    if (!share) throw new Error('Share not found');

    const recipients = await ShareRecipient.find(
      { shareId },
      'recipientEmail status accessCount firstAccessedAt lastAccessedAt revokedAt'
    );

    const recipientStats = {
      total: recipients.length,
      pending: recipients.filter(r => r.status === 'pending').length,
      accessed: recipients.filter(r => r.status === 'accessed').length,
      revoked: recipients.filter(r => r.status === 'revoked').length,
    };

    return {
      share: share.toObject(),
      recipients: recipients.map(r => ({
        email: r.recipientEmail,
        status: r.status,
        accessCount: r.accessCount,
        firstAccessedAt: r.firstAccessedAt,
        lastAccessedAt: r.lastAccessedAt,
        revokedAt: r.revokedAt,
      })),
      stats: recipientStats,
      isExpired: share.expiresAt < new Date(),
    };
  }

  /**
   * Check if recipient has active access
   * @param {string} accessToken - Recipient's access token
   * @returns {object} - Access status information
   */
  static async checkAccessStatus(accessToken) {
    const recipient = await ShareRecipient.findOne({ accessToken })
      .populate('shareId', 'shareId expiresAt status');

    if (!recipient) {
      return { hasAccess: false, reason: 'Invalid token' };
    }

    if (recipient.status === 'revoked') {
      return { hasAccess: false, reason: 'Access revoked' };
    }

    if (recipient.shareId.expiresAt < new Date()) {
      return { hasAccess: false, reason: 'Share expired' };
    }

    if (recipient.shareId.status === 'revoked') {
      return { hasAccess: false, reason: 'Share revoked' };
    }

    return {
      hasAccess: true,
      recipientEmail: recipient.recipientEmail,
      accessCount: recipient.accessCount,
      expiresAt: recipient.shareId.expiresAt,
      maxAccessCount: recipient.maxAccessCount,
    };
  }

  /**
   * Cleanup expired shares and recipients
   * @returns {object} - Cleanup statistics
   */
  static async cleanupExpiredShares() {
    const now = new Date();

    const expiredShares = await PasswordShare.deleteMany({ expiresAt: { $lt: now } });
    const orphanedRecipients = await ShareRecipient.deleteMany({
      shareId: { $nin: await PasswordShare.find({}, '_id') },
    });

    return {
      deletedShares: expiredShares.deletedCount,
      deletedOrphanedRecipients: orphanedRecipients.deletedCount,
      timestamp: now,
    };
  }

  /**
   * Get access analytics for a share
   * @param {string} shareId - Share MongoDB ID
   * @returns {object} - Analytics data
   */
  static async getAccessAnalytics(shareId) {
    const share = await PasswordShare.findById(shareId);
    if (!share) throw new Error('Share not found');

    const recipients = await ShareRecipient.find({ shareId });
    const accessedRecipients = recipients.filter(r => r.lastAccessedAt);

    const timeline = recipients
      .filter(r => r.accessHistory && r.accessHistory.length > 0)
      .flatMap(r => r.accessHistory.map(h => ({ ...h, recipientEmail: r.recipientEmail })))
      .sort((a, b) => a.accessedAt - b.accessedAt);

    const topIps = {};
    timeline.forEach(event => {
      topIps[event.ipAddress] = (topIps[event.ipAddress] || 0) + 1;
    });

    return {
      share: {
        id: share.shareId,
        createdAt: share.createdAt,
        expiresAt: share.expiresAt,
        totalAccesses: share.totalAccessCount,
      },
      recipients: {
        total: recipients.length,
        accessed: accessedRecipients.length,
        pending: recipients.filter(r => r.status === 'pending').length,
        revoked: recipients.filter(r => r.status === 'revoked').length,
      },
      accessTimeline: timeline.slice(-50), // Last 50 accesses
      topAccessIps: Object.entries(topIps)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([ip, count]) => ({ ip, accessCount: count })),
      accessedTimestamps: {
        first: share.createdAt,
        last: share.accessedAt,
      },
    };
  }
}

module.exports = MultiRecipientService;
