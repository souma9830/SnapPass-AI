import { sanitizePayloadDeep } from '../utils/payloadSanitizer.utils.js';
import { validateInputKeys } from '../validation/inputRule.validation.js';

describe('Payload Deep Sanitization & Input Validation', () => {
  test('sanitizePayloadDeep strips script tags and mongo operators', () => {
    const dirty = {
      name: '<script>alert("xss")</script>John',
      $where: 'this.age > 10',
      nested: {
        bio: 'Hello <script>bad()</script>',
      },
    };

    const clean = sanitizePayloadDeep(dirty);
    expect(clean.name).toBe('John');
    expect(clean.$where).toBeUndefined();
    expect(clean.nested.bio).toBe('Hello');
  });

  test('validateInputKeys detects prohibited keys', () => {
    expect(validateInputKeys({ normalKey: 'val' }).isValid).toBe(true);
    expect(validateInputKeys({ $gt: 5 }).isValid).toBe(false);
  });
});
