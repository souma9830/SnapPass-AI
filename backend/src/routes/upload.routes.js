/**
 * Upload Routes
 * POST /api/upload  — Upload a photo
 * GET  /api/upload/:fileId — Get upload metadata
 */

import express from 'express';
import {
  uploadPhoto,
  getUploadedPhoto,
} from '../controllers/upload.controller.js';
import { uploadMiddleware, validateImageBuffer } from '../middleware/upload.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Enforce allowed formats on server as well (client can be bypassed).
router.post(
  '/',
  authMiddleware,
  uploadMiddleware.single('photo'),
  validateImageBuffer,
  uploadPhoto
);
router.get('/:fileId', authMiddleware, getUploadedPhoto);


export default router;
