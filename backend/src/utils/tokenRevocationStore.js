import crypto from 'crypto';

class TokenRevocationStore {
  constructor() {
    this.revokedTokens = new Map();
  }

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  revoke(token, ttlMs = 7 * 24 * 60 * 60 * 1000) {
    const hash = this.hashToken(token);
    const expiresAt = Date.now() + ttlMs;
    this.revokedTokens.set(hash, expiresAt);
    
    setTimeout(() => {
      if (this.revokedTokens.get(hash) === expiresAt) {
        this.revokedTokens.delete(hash);
      }
    }, ttlMs).unref?.();
  }

  isRevoked(token) {
    const hash = this.hashToken(token);
    const expiresAt = this.revokedTokens.get(hash);
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      this.revokedTokens.delete(hash);
      return false;
    }
    return true;
  }

  clear() {
    this.revokedTokens.clear();
  }
}

export const tokenRevocationStore = new TokenRevocationStore();
