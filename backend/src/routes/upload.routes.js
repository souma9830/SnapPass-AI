import express from 'express';
import { uploadPhoto } from '../controllers/upload.controller.js';
const router = express.Router();

router.post('/', uploadPhoto);

export default router;