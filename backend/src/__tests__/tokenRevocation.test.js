import { RevocationStoreService } from '../services/revocationStore.service.js';
import { validateTokenRevocationRequest } from '../validation/tokenRevocation.validation.js';

describe('Token Revocation Store & Validation', () => {
  beforeEach(() => {
    RevocationStoreService.clearAll();
  });

  test('RevocationStoreService successfully revokes and checks tokens', () => {
    const jti = 'test-token-uuid-123';
    expect(RevocationStoreService.isRevoked(jti)).toBe(false);
    RevocationStoreService.revokeToken(jti, 10);
    expect(RevocationStoreService.isRevoked(jti)).toBe(true);
  });

  test('validateTokenRevocationRequest validates incoming body', () => {
    expect(validateTokenRevocationRequest({ tokenId: 'jwt-jti-val' }).isValid).toBe(true);
    expect(validateTokenRevocationRequest({}).isValid).toBe(false);
    expect(validateTokenRevocationRequest({ tokenId: 'valid', ttlSeconds: -10 }).isValid).toBe(false);
  });
});
