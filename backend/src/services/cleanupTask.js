import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';

export class CleanupTask {
  /**
   * Cleans up files older than the specified age in a directory.
   */
  static async execute(dirPath, maxAgeMs) {
    try {
      logger.info(`Starting storage cleanup execution on directory: ${dirPath}`);
      const files = await fs.readdir(dirPath);
      const now = Date.now();
      let count = 0;

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);
        
        // Skip subdirectories (like 'processed') unless recursing
        if (stat.isDirectory()) continue;

        if (now - stat.mtimeMs > maxAgeMs) {
          await fs.unlink(filePath);
          count++;
        }
      }
      logger.info(`Cleanup finished. Removed ${count} expired files.`);
    } catch (error) {
      logger.error(`Error during file cleanup: ${error.message}`);
    }
  }

  /**
   * Starts a periodic cron-like interval timer for background cleanups.
   */
  static startScheduler() {
    const intervalMs = 60 * 60 * 1000; // Run every hour
    const maxAgeMs = config.RETENTION_MAX_AGE_MS || 24 * 60 * 60 * 1000; // Default 24 hours
    
    logger.info('Initializing background storage cleanup scheduler...');
    setInterval(async () => {
      const uploadsDir = path.resolve(process.cwd(), config.UPLOAD_DIR || 'uploads');
      await CleanupTask.execute(uploadsDir, maxAgeMs);
      
      const processedDir = path.join(uploadsDir, 'processed');
      await CleanupTask.execute(processedDir, maxAgeMs);
    }, intervalMs);
  }
}
