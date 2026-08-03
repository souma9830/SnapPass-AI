import cron from 'node-cron';
import Session from '../models/session.model.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';

export class SessionCleaner {
  /**
   * Deactivates sessions that have been inactive (unused) past the configured
   * inactivity limit, based on the `updatedAt` timestamp.
   */
  static async execute() {
    try {
      const cutoff = new Date(Date.now() - config.SESSION_INACTIVITY_LIMIT_MS);
      logger.info(
        `Starting inactive session cleanup (inactivity limit: ${config.SESSION_INACTIVITY_LIMIT_MS}ms, cutoff: ${cutoff.toISOString()})...`
      );
      const result = await Session.updateMany(
        { isValid: true, updatedAt: { $lt: cutoff } },
        { $set: { isValid: false } }
      );
      logger.info(
        `Session cleanup finished. Deactivated ${result.modifiedCount} inactive session(s).`
      );
      return result.modifiedCount;
    } catch (error) {
      logger.error(`Error during session cleanup: ${error.message}`);
      return 0;
    }
  }

  /**
   * Schedules the inactive session cleanup via node-cron.
   * Runs daily at 02:00 by default; override with the SESSION_CLEANUP_CRON env var.
   */
  static startScheduler() {
    const cronExpression = process.env.SESSION_CLEANUP_CRON || '0 2 * * *';
    logger.info(
      `Initializing inactive session cleanup scheduler (cron: "${cronExpression}")...`
    );
    return cron.schedule(cronExpression, () => {
      SessionCleaner.execute();
    });
  }
}
