import express from 'express';
import { uploadPhoto, batchUpload } from '../controllers/upload.controller.js';
import { uploadMiddleware, uploadSinglePhotoOrFile, validateImageBuffer, validateImageChain } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/', uploadSinglePhotoOrFile, validateImageBuffer, validateImageChain, uploadPhoto);
router.post('/batch', uploadMiddleware.array('files', 20), batchUpload);

export default router;
