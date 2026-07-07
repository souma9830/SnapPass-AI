import express from 'express';
import multer from 'multer';
import { uploadPhoto, batchUpload } from '../controllers/upload.controller.js';
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('file'), uploadPhoto);
router.post('/batch', upload.array('files', 20), batchUpload);

export default router;
