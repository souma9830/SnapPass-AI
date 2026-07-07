// Thread-safe in-memory cache store for revoked JWT tokens to prevent reuse
class TokenStore {
  constructor() {
    this.blacklist = new Set();
  }

  add(token, expiresAt) {
    this.blacklist.add(token);
    const delay = expiresAt - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        this.blacklist.delete(token);
      }, delay);
    }
  }

  has(token) {
    return this.blacklist.has(token);
  }
}

export const tokenStore = new TokenStore();
