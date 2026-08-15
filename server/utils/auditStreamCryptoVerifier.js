const crypto = require('crypto');

/**
 * Audit Stream Crypto Verifier
 * Implements HMAC SHA-256 tamper-evident integrity hashing for audit log event chains.
 */
class AuditStreamCryptoVerifier {
  constructor(secretKey = 'snappass_audit_secret_default_key') {
    this.secretKey = secretKey;
    this.previousHash = '0000000000000000000000000000000000000000000000000000000000000000';
  }

  /**
   * Generates a cryptographic HMAC hash for an audit log entry chained to previous hash.
   * @param {Object} event - Audit event payload
   * @returns {Object} Signed audit event with recordHash and previousHash
   */
  signEvent(event) {
    const timestamp = event.timestamp || new Date().toISOString();
    const eventPayload = {
      action: event.action,
      userId: event.userId || 'anonymous',
      details: event.details || {},
      timestamp,
      previousHash: this.previousHash
    };

    const payloadString = JSON.stringify(eventPayload);
    const hash = crypto
      .createHmac('sha256', this.secretKey)
      .update(payloadString)
      .digest('hex');

    const signedEvent = {
      ...eventPayload,
      recordHash: hash
    };

    this.previousHash = hash;
    return signedEvent;
  }

  /**
   * Verifies the tamper-evident integrity of an audit chain.
   * @param {Array<Object>} chain - Array of signed audit events
   * @returns {{isValid: boolean, corruptedIndex: number | null, reason: string | null}}
   */
  verifyChain(chain) {
    if (!Array.isArray(chain) || chain.length === 0) {
      return { isValid: true, corruptedIndex: null, reason: 'Empty chain is valid' };
    }

    let expectedPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 0; i < chain.length; i++) {
      const entry = chain[i];

      if (entry.previousHash !== expectedPrevHash) {
        return {
          isValid: false,
          corruptedIndex: i,
          reason: `Broken chain link at index ${i}: expected prevHash ${expectedPrevHash}, got ${entry.previousHash}`
        };
      }

      const eventPayload = {
        action: entry.action,
        userId: entry.userId,
        details: entry.details,
        timestamp: entry.timestamp,
        previousHash: entry.previousHash
      };

      const calculatedHash = crypto
        .createHmac('sha256', this.secretKey)
        .update(JSON.stringify(eventPayload))
        .digest('hex');

      if (calculatedHash !== entry.recordHash) {
        return {
          isValid: false,
          corruptedIndex: i,
          reason: `Tampered payload detected at index ${i}: hash mismatch`
        };
      }

      expectedPrevHash = entry.recordHash;
    }

    return { isValid: true, corruptedIndex: null, reason: 'Chain verification successful' };
  }
}

module.exports = AuditStreamCryptoVerifier;
