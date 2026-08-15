
const calc = require('../services/priceMatrixCalculator');
exports.getEstimate = (req, res) => res.json({ total: calc.calculate(req.body || {}) });
