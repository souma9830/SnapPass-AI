import express from 'express';
import { detectFaces } from '../controllers/faceDetection.controller.js';
import { sanitizeInput } from '../middleware/sanitize.middleware.js';

const router = express.Router();

router.post('/', sanitizeInput, detectFaces);

export default router;
