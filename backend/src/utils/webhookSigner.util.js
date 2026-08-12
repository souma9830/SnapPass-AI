/**
 * webhookSigner.util.js — HMAC SHA-256 Webhook Event Signer
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import crypto from 'crypto';

export function signWebhookPayload(payload, secret) {
  const jsonStr = JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(jsonStr).digest('hex');
}
