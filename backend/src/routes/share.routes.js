import express from 'express';
import {
  createShareLink,
  getShareMeta,
  accessShareLink,
  downloadShareLink,
  revokeShareLink,
} from '../controllers/share.controller.js';
import { sanitizeInput } from '../middleware/sanitize.middleware.js';

const router = express.Router();

router.post('/create', sanitizeInput, createShareLink);
router.get('/:shareId/meta', sanitizeInput, getShareMeta);
router.post('/:shareId/access', sanitizeInput, accessShareLink);
router.get('/:shareId/download', sanitizeInput, downloadShareLink);
router.delete('/:shareId', sanitizeInput, revokeShareLink);

export default router;
