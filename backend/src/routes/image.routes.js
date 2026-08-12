import express from 'express';
import { processImage } from '../controllers/image.controller.js';
import { sanitizeInput } from '../middleware/sanitize.middleware.js';
import { optionallyAuthenticated } from '../middleware/optionalAuth.middleware.js';
const router = express.Router();

// Image processing router communicating with the Python AI Flask service
router.post('/', optionallyAuthenticated, sanitizeInput, processImage);
router.post('/process', optionallyAuthenticated, sanitizeInput, processImage);

export default router;