/**
 * Upload Routes
 * POST /api/upload           — Upload a photo (Private — requires authentication)
 * GET  /api/upload/:fileId   — Get upload metadata (Private — requires authentication)
 */

import express from 'express';
import {
  uploadPhoto,
  getUploadedPhoto,
} from '../controllers/upload.controller.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, uploadMiddleware.single('photo'), uploadPhoto);
router.get('/:fileId', authMiddleware, getUploadedPhoto);

export default router;
