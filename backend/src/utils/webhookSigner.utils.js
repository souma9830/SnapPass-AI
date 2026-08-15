/**
 * webhookSigner.utils.js — HMAC-SHA256 payload signer for webhooks.
 */
import crypto from 'crypto';

export const signWebhookPayload = (payload, secret) => {
  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(serialized).digest('hex');
};
