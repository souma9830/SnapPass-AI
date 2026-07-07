import express from 'express';
import {
  getAuditLogs,
  getAuditSummary,
} from '../controllers/audit.controller.js';

const router = express.Router();

router.get('/', getAuditLogs);
router.get('/summary', getAuditSummary);

export default router;
