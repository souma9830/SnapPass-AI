
const blacklist = require('../utils/tokenBlacklist');
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (blacklist.has(token)) {
            return res.status(401).json({ error: "Token revoked" });
        }
    }
    next();
};
