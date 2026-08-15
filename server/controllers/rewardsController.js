
const engine = require('../services/loyaltyRewardEngine');
exports.getReward = (req, res) => res.json({ points: engine.calculatePoints(100, req.query.tier || 'VIP') });
