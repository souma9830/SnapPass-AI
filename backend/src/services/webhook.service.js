/**
 * webhook.service.js — Async Webhook Event Dispatcher Service
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import axios from 'axios';
import { signWebhookPayload } from '../utils/webhookSigner.util.js';

export class WebhookService {
  static async dispatchEvent(targetUrl, payload, secret) {
    const signature = signWebhookPayload(payload, secret);
    return await axios.post(targetUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Signature-256': signature,
      },
      timeout: 5000,
    });
  }
}
