
const engine = require('../services/payoutSplitEngine');
exports.getPayout = (req, res) => res.json(engine.calculateSplit(req.body.amount || 100));
