import { Resend } from 'resend';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

const resend = new Resend(config.RESEND_API_KEY);

export class NotificationService {
  /**
   * Sends an email notification.
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} html - HTML email body
   */
  static async sendEmail(to, subject, html) {
    try {
      const email = await resend.emails.send({
        from: config.EMAIL_FROM,
        to,
        subject,
        html,
      });
      logger.info(`Email sent successfully: ${email?.id}`);
      return email;
    } catch (error) {
      logger.error(`Error sending email: ${error.message}`);
      throw error;
    }
  }
}
