import axios from 'axios';
import { logger } from '../utils/logger.js';

export class WebhookService {
  /**
   * Triggers a webhook event and sends a payload to a target URL.
   * @param {string} url - Target URL
   * @param {string} event - Event name (e.g. 'image.processed')
   * @param {object} payload - Data payload
   */
  static async trigger(url, event, payload) {
    if (!url) return;
    try {
      logger.info(`Triggering webhook ${event} to ${url}`);
      await axios.post(url, {
        event,
        timestamp: new Date().toISOString(),
        data: payload
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-SnapPass-Event': event
        },
        timeout: 5000
      });
    } catch (error) {
      logger.error(`Webhook delivery failed for event ${event}: ${error.message}`);
    }
  }
}
