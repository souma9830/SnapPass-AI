
const Engine = require('../services/disputeWorkflowEngine');
const engine = new Engine();
exports.updateDispute = (req, res) => {
    const success = engine.transition(req.body.state);
    res.json({ state: engine.state, success });
};
