import express from 'express';
import { uploadPhoto, batchUpload } from '../controllers/upload.controller.js';
import { uploadMiddleware, uploadSinglePhotoOrFile, validateImageChain } from '../middleware/upload.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, uploadSinglePhotoOrFile, validateImageChain, uploadPhoto);
router.post('/batch', authMiddleware, uploadMiddleware.array('files', 20), batchUpload);

export default router;
