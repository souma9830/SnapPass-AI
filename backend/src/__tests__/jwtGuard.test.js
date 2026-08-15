/**
 * jwtGuard.test.js — JWT Guard Unit Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { JwtGuardService } from '../services/jwtGuard.service.js';

describe('JwtGuardService Tests', () => {
  it('should throw error in production when secret is dev_secret_fallback', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete process.env.JWT_SECRET;
    expect(() => JwtGuardService.validateEnvironmentSecret()).toThrow();
    process.env.NODE_ENV = originalEnv;
  });
});
