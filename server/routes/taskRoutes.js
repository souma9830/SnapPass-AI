
const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskDispatcherController');
const { auditLoggerMiddleware, getAuditLogs } = require('../middleware/auditLoggerMiddleware');

router.use(auditLoggerMiddleware);
router.post('/dispatch', controller.dispatchTask);
router.get('/audit-logs', (req, res) => {
  res.json({ success: true, logs: getAuditLogs(Number(req.query.limit) || 50) });
});

module.exports = router;
