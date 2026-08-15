
const engine = require('../services/warrantyManagerEngine');
exports.claim = (req, res) => res.json({ valid: engine.verifyClaim(req.body.claimDate, req.body.expiry) });
