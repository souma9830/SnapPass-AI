import logger from './logger.js';

export class TelemetryLogger {
  static logEvent(eventName, payload = {}) {
    logger.info({
      event: eventName,
      timestamp: new Date().toISOString(),
      ...payload,
    });
  }

  static logError(eventName, error, payload = {}) {
    logger.error({
      event: eventName,
      error: error?.message || String(error),
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      ...payload,
    });
  }
}
