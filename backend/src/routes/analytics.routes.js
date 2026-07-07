import { Router } from 'express';
import { getDashboardStats, getUploadsByDay } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/trend', getUploadsByDay);

export default router;
