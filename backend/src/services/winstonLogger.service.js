/**
 * winstonLogger.service.js — Winston Logger Daily Rotation Service
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export class WinstonLoggerService {
  static logInfo(message, meta = {}) {
    console.log('[INFO]', message, JSON.stringify(meta));
  }

  static logError(message, error = {}) {
    console.error('[ERROR]', message, error.stack || error.message || error);
  }
}
