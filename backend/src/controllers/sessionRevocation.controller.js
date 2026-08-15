const store = require('../services/sessionRevocationStoreService');

exports.revokeToken = (req, res) => {
    const { token } = req.body || {};
    store.revoke(token);
    res.status(200).json({ success: true, message: 'Token revoked.' });
};