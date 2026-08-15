
const tracker = require('../utils/chatDeliveryTracker');
exports.ack = (req, res) => { tracker.ack(req.body.msgId); res.json({ ack: true }); };
