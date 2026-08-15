
const supervisor = require('../config/dbPoolSupervisor');
exports.getHealth = (req, res) => res.json({ connected: supervisor.connected });
