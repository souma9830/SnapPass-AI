
const RefreshTokenService = require('../services/refreshTokenService');
const blacklist = require('../utils/tokenBlacklist');

exports.refreshToken = (req, res) => {
    try {
        const { token } = req.body;
        const result = RefreshTokenService.rotateToken(token);
        res.json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};
exports.revokeToken = (req, res) => {
    const { token } = req.body;
    blacklist.add(token);
    res.json({ message: "Token revoked" });
};
