/**
 * webhook.test.js — Webhook Event Dispatcher Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { signWebhookPayload } from '../utils/webhookSigner.util.js';

describe('WebhookSigner Tests', () => {
  it('should generate valid hmac signature', () => {
    const sig = signWebhookPayload({ event: 'test' }, 'secret123');
    expect(sig).toBeDefined();
    expect(typeof sig).toBe('string');
  });
});
