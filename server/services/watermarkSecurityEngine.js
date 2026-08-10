/**
 * Watermark Security Engine for Digital Passport Anti-Spoofing & Asset Protection.
 * Generates cryptographic invisible steganographic signatures and visual security watermarks.
 */

const crypto = require('crypto');

class WatermarkSecurityEngine {
  constructor(secretKey = process.env.WATERMARK_SECRET || 'snappass-secure-watermark-key-2026') {
    this.secretKey = secretKey;
  }

  /**
   * Generates a tamper-evident cryptographic watermark token for photo assets.
   */
  generateWatermarkToken(photoId, tenantId, timestamp = Date.now()) {
    const payload = `${photoId}:${tenantId}:${timestamp}`;
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(payload);
    const signature = hmac.digest('hex');
    return {
      photoId,
      tenantId,
      timestamp,
      signature: signature.substring(0, 16),
      watermarkHeader: `SP-SEC-${signature.substring(0, 8)}`
    };
  }

  /**
   * Verifies the authenticity of a embedded photo watermark token.
   */
  verifyWatermarkToken(photoId, tenantId, timestamp, signature) {
    const expected = this.generateWatermarkToken(photoId, tenantId, timestamp);
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expected.signature),
      Buffer.from(signature)
    );
    return {
      isValid,
      photoId,
      verifiedAt: new Date().toISOString()
    };
  }
}

module.exports = new WatermarkSecurityEngine();
