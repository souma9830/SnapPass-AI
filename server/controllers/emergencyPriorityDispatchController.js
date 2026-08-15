
const engine = require('../services/emergencyDispatchEngine');
exports.triggerSOS = (req, res) => res.json(engine.dispatchSOS(req.body));
