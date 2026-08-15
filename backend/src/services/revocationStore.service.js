/**
 * revocationStore.service.js — TTL-backed token revocation registry.
 */

const revokedTokensMap = new Map();

export class RevocationStoreService {
  static revokeToken(tokenId, ttlSeconds = 3600) {
    if (!tokenId) return false;
    const expiresAt = Date.now() + ttlSeconds * 1000;
    revokedTokensMap.set(tokenId, expiresAt);

    const timer = setTimeout(() => {
      if (revokedTokensMap.get(tokenId) === expiresAt) {
        revokedTokensMap.delete(tokenId);
      }
    }, ttlSeconds * 1000);

    if (timer && typeof timer.unref === 'function') {
      timer.unref();
    }

    return true;
  }


  static isRevoked(tokenId) {
    if (!tokenId || !revokedTokensMap.has(tokenId)) return false;
    const expiresAt = revokedTokensMap.get(tokenId);
    if (Date.now() > expiresAt) {
      revokedTokensMap.delete(tokenId);
      return false;
    }
    return true;
  }

  static clearAll() {
    revokedTokensMap.clear();
  }
}
