import express from 'express';
import { processImage } from '../controllers/image.controller.js';
import { sanitizeInput } from '../middleware/sanitize.middleware.js';
const router = express.Router();

router.post('/process', sanitizeInput, processImage);

export default router;