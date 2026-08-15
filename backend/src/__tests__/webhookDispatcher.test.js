import { signWebhookPayload } from '../utils/webhookSigner.utils.js';
import { validateWebhookEndpoint } from '../validation/webhookPayload.validation.js';

describe('Webhook Event Dispatcher & Signer', () => {
  test('signWebhookPayload produces HMAC signature', () => {
    const payload = { event: 'PHOTO_PROCESSED', id: 123 };
    const sig = signWebhookPayload(payload, 'secret-key-123');
    expect(sig).toBeDefined();
    expect(sig.length).toBe(64);
  });

  test('validateWebhookEndpoint validates url and secret', () => {
    expect(validateWebhookEndpoint({ targetUrl: 'https://example.com/hook', secret: '12345678' }).isValid).toBe(true);
    expect(validateWebhookEndpoint({ targetUrl: 'invalid-url', secret: 'short' }).isValid).toBe(false);
  });
});
