/**
 * Compliance Routes
 * POST /api/compliance-check — Runs real-time passport photo compliance checklist.
 */

import express from 'express';
import {
  complianceCheck,
  complianceAutoCorrect,
} from '../controllers/compliance.controller.js';
import { optionallyAuthenticated } from '../middleware/optionalAuth.middleware.js';

const router = express.Router();

router.post('/check', optionallyAuthenticated, complianceCheck);
router.post('/auto-correct', optionallyAuthenticated, complianceAutoCorrect);

export default router;
