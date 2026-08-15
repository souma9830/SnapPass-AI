import { tokenRevocationStore } from '../tokenRevocationStore.js';

describe('TokenRevocationStore Utility', () => {
  test('revokes token and checks status correctly', () => {
    const testToken = 'sample.jwt.token';
    expect(tokenRevocationStore.isRevoked(testToken)).toBe(false);

    tokenRevocationStore.revoke(testToken, 5000);
    expect(tokenRevocationStore.isRevoked(testToken)).toBe(true);

    tokenRevocationStore.clear();
    expect(tokenRevocationStore.isRevoked(testToken)).toBe(false);
  });
});
