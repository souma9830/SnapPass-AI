
const engine = require('../services/referralEngine');
exports.evaluateReferral = (req, res) => res.json(engine.evaluate(req.body.referrer, req.body.referred));
