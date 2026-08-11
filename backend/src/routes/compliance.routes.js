/**
 * Compliance Routes
 * POST /api/compliance-check — Runs real-time passport photo compliance checklist.
 */

import express from 'express';
import {
  complianceCheck,
  complianceAutoCorrect,
  complianceExportStream,
} from '../controllers/compliance.controller.js';

const router = express.Router();

router.post('/check', complianceCheck);
router.post('/auto-correct', complianceAutoCorrect);
router.get('/stream/export-stream', complianceExportStream);

export default router;
