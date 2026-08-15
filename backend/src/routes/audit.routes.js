import express from 'express';
import {
  getAuditLogs,
  getAuditSummary,
  exportAuditLogs,
} from '../controllers/audit.controller.js';

const router = express.Router();

router.get('/', getAuditLogs);
router.get('/summary', getAuditSummary);
router.get('/export', exportAuditLogs);

export default router;

