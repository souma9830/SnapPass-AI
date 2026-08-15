const store = require('../services/sessionRevocationStoreService');

describe('SessionRevocationStoreService', () => {
    it('revokes session token', () => {
        store.revoke('token_abc');
        expect(store.isRevoked('token_abc')).toBe(true);
    });
});