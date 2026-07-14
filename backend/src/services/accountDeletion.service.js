import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import UploadHistory from '../models/UploadHistory.js';
import logger from '../utils/logger.js';
import { runInTransaction } from '../utils/dbTransaction.js';

export class AccountDeletionService {
  /**
   * Purges all user data inside a secure transaction.
   * @param {string} userId 
   */
  static async purgeUserData(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID');
    }

    logger.info(`Initiating data purge for user: ${userId}`);

    return await runInTransaction(async (session) => {
      // 1. Delete user uploads history
      const uploadsPurged = await UploadHistory.deleteMany({ user: userId }).session(session);
      logger.info(`Purged ${uploadsPurged.deletedCount} uploads history items.`);

      // 2. Invalidate sessions
      const sessionsPurged = await Session.deleteMany({ userId }).session(session);
      logger.info(`Revoked ${sessionsPurged.deletedCount} active sessions.`);

      // 3. Delete user account record
      const userDeleted = await User.findByIdAndDelete(userId).session(session);
      if (!userDeleted) {
        throw new Error('User not found');
      }

      logger.info(`Account deleted successfully for user ID: ${userId}`);
      return { success: true };
    });
  }
}
