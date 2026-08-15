import { Router } from 'express';
import { logPrintTransaction, getDailyAnalytics } from '../controllers/studioAnalytics.controller.js';

const router = Router();

router.post('/log-print', logPrintTransaction);
router.get('/daily', getDailyAnalytics);

export default router;
