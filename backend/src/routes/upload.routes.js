import express from 'express';
import { uploadPhoto, batchUpload } from '../controllers/upload.controller.js';
import { uploadMiddleware, uploadSinglePhotoOrFile, validateImageChain, validateBatchImageChain } from '../middleware/upload.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { uploadLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, uploadSinglePhotoOrFile, validateImageChain, uploadPhoto);
router.post('/batch', authMiddleware, uploadLimiter, uploadMiddleware.array('files', 20), validateBatchImageChain, batchUpload);

export default router;
