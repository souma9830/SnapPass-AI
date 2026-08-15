/**
 * sessionFailover.middleware.js — Fault tolerant session revocation checker middleware
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { fallbackRevocationStore } from '../services/sessionRevocationStoreService.js';
import { isRedisAvailable } from '../config/redis.js';

export function sessionFailoverMiddleware(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return next();

  try {
    if (!isRedisAvailable()) {
      if (fallbackRevocationStore.isRevoked(token)) {
        return res.status(401).json({ success: false, error: 'TOKEN_REVOKED_FALLBACK' });
      }
    }
  } catch (err) {
    console.error('Session failover evaluation error:', err);
  }
  next();
}
