/**
 * sessionRevocationStoreService.js — In-memory LRU fallback session revocation store
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export class SessionRevocationStoreService {
  constructor(capacity = 5000) {
    this.capacity = capacity;
    this.revokedTokens = new Map();
  }

  revoke(tokenId, ttlMs = 86400000) {
    if (this.revokedTokens.size >= this.capacity) {
      const firstKey = this.revokedTokens.keys().next().value;
      this.revokedTokens.delete(firstKey);
    }
    const expiresAt = Date.now() + ttlMs;
    this.revokedTokens.set(tokenId, expiresAt);
  }

  isRevoked(tokenId) {
    const expiresAt = this.revokedTokens.get(tokenId);
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      this.revokedTokens.delete(tokenId);
      return false;
    }
    return true;
  }
}

export const fallbackRevocationStore = new SessionRevocationStoreService();