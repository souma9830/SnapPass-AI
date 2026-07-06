/**
 * Compliance Routes
 * POST /api/compliance-check — Runs real-time passport photo compliance checklist.
 */

import express from 'express';
import {
  complianceCheck,
  complianceAutoCorrect,
} from '../controllers/compliance.controller.js';

const router = express.Router();

router.post('/check', complianceCheck);
router.post('/auto-correct', complianceAutoCorrect);

export default router;
