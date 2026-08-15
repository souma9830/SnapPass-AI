/**
 * jwtGuard.service.js — JWT Secret & Token Blacklist Rotation Guard
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export class JwtGuardService {
  static validateEnvironmentSecret() {
    const secret = process.env.JWT_SECRET;
    if (process.env.NODE_ENV === 'production' && (!secret || secret === 'dev_secret_fallback')) {
      throw new Error('FATAL: Insecure JWT_SECRET configured in production environment.');
    }
    return secret || 'dev_secret_fallback';
  }
}
