import { Router } from 'express';
import { getServerMetrics, resetServerMetrics } from '../controllers/metrics.controller.js';

const router = Router();

router.get('/', getServerMetrics);
router.delete('/', resetServerMetrics);

export default router;
