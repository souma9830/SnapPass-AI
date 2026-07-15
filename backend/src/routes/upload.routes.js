import express from 'express';
import { uploadPhoto, batchUpload } from '../controllers/upload.controller.js';
import { uploadMiddleware, validateImageChain } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/', uploadMiddleware.single('photo'), validateImageChain, uploadPhoto);
router.post('/batch', uploadMiddleware.array('files', 20), batchUpload);

export default router;
