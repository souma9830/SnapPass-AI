import { Router } from 'express';
import { handleBatchExport } from '../controllers/batchExport.controller.js';

const router = Router();

/**
 * POST /api/batch-export
 * Export multiple processed passport photos in a single zip archive
 */
router.post('/batch-export', handleBatchExport);

export default router;
