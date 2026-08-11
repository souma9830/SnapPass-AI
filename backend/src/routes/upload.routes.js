import express from 'express';
import { uploadPhoto, batchUpload } from '../controllers/upload.controller.js';
import { uploadMiddleware, uploadSinglePhotoOrFile, validateImageChain, validateImageChainBatch } from '../middleware/upload.middleware.js';
import { uploadLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

const MAX_BATCH_FILES = 10;

router.post('/', uploadSinglePhotoOrFile, validateImageChain, uploadPhoto);
router.post(
  '/batch',
  uploadLimiter,
  (req, res, next) => {
    if (req.files && req.files.length > MAX_BATCH_FILES) {
      return res
        .status(400)
        .json({ error: `Maximum ${MAX_BATCH_FILES} files per batch request.` });
    }
    next();
  },
  uploadMiddleware.array('files', MAX_BATCH_FILES),
  validateImageChainBatch,
  batchUpload,
);

export default router;
