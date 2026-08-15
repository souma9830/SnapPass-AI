import express from 'express';
import {
  getAuditLogs,
  getAuditStats,
  exportAuditLogs,
} from '../controllers/audit.controller.js';

const router = express.Router();

router.get('/', getAuditLogs);
router.get('/summary', getAuditStats);
router.get('/export', exportAuditLogs);

export default router;
