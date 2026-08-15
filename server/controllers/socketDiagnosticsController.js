
const machine = require('../utils/socketHeartbeatMachine');
exports.getStats = (req, res) => res.json({ count: machine.activeSockets.size });
