/**
 * Process job routes
 *
 * POST /api/process/job
 * GET  /api/process/job/:jobId
 */

import express from 'express';
import {
  createProcessJob,
  getProcessJobStatus,
  getAllProcessJobs,
  retryProcessJob,
  cancelOrDeleteProcessJob,
  repairImageQualityController,
} from '../controllers/image.controller.js';

const router = express.Router();

router.get('/jobs', getAllProcessJobs);
router.post('/job', createProcessJob);
router.get('/job/:jobId', getProcessJobStatus);
router.get('/jobs', getAllProcessJobs);
router.post('/job/:jobId/retry', retryProcessJob);
router.delete('/job/:jobId', cancelOrDeleteProcessJob);

router.post('/repair-quality', repairImageQualityController);

export default router;

