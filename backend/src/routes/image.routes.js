import express from 'express';
import { processImage } from '../controllers/image.controller.js';
import { sanitizeInput } from '../middleware/sanitize.middleware.js';
const router = express.Router();

// Image processing router communicating with the Python AI Flask service
router.post('/', sanitizeInput, processImage);
router.post('/process', sanitizeInput, processImage);

export default router;