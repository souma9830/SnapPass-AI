
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auditLogController');
router.get('/', controller.getAuditLogs);
module.exports = router;
