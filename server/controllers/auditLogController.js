
const auditModel = require('../models/AuditLog');
exports.getAuditLogs = (req, res) => res.json(auditModel.logs);
