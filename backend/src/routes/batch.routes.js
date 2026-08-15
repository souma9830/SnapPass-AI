import { Router } from 'express';
import { exportBatch } from '../controllers/batch.controller.js';

const router = Router();

router.post('/export', exportBatch);

export default router;
