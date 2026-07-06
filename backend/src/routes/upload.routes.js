import express from 'express';
import { uploadPhoto } from '../controllers/upload.controller.js';
import {
  uploadMiddleware,
  validateImageChain,
} from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * POST /api/upload
 *
 * Middleware chain:
 *   uploadMiddleware  — multer: MIME filter + UUID filename + size limit
 *   validateImageChain — magic bytes + pixel dimensions + compression-ratio
 *   uploadPhoto        — controller: build + return structured response
 *
 * Errors from multer (e.g. file-too-large, wrong MIME) are caught by the
 * global error middleware via next(err) and returned as 400 / 413 JSON.
 */
router.post(
  '/',
  uploadMiddleware.single('photo'),
  validateImageChain,
  uploadPhoto
);

export default router;
