
const blacklist = require('../utils/tokenBlacklist');
const crypto = require('crypto');

class RefreshTokenService {
    static rotateToken(oldToken) {
        if (blacklist.has(oldToken)) {
            throw new Error("Token revoked / replayed");
        }
        blacklist.add(oldToken);
        const newToken = "rt_" + crypto.randomBytes(16).toString('hex');
        return { refreshToken: newToken };
    }
}
module.exports = RefreshTokenService;
