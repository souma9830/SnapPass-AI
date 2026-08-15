/**
 * sessionFailover.test.js — Redis Session Failover Store Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { fallbackRevocationStore } from '../services/sessionRevocationStoreService.js';

describe('SessionFailoverStore Tests', () => {
  it('should store and detect revoked session token', () => {
    fallbackRevocationStore.revoke('test-token-123', 5000);
    expect(fallbackRevocationStore.isRevoked('test-token-123')).toBe(true);
  });

  it('should return false for active non-revoked session token', () => {
    expect(fallbackRevocationStore.isRevoked('valid-token-999')).toBe(false);
  });
});
