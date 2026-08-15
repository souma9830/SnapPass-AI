import express from 'express';
import { uploadPhoto, batchUpload } from '../controllers/upload.controller.js';
import { uploadMiddleware, uploadSinglePhotoOrFile, validateImageChain } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/', uploadSinglePhotoOrFile, validateImageChain, uploadPhoto);
router.post('/batch', uploadMiddleware.array('files', 20), batchUpload);

export default router;
