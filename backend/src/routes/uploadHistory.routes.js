/**
 * Upload History Routes
 *
 * GET /api/v1/upload-history
 */

import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getUserUploadHistory } from '../controllers/uploadHistory.controller.js';

const router = express.Router();

router.get('/', authMiddleware, getUserUploadHistory);

export default router;

