import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXT.has(ext) ? ext : '.jpg';
    cb(null, `${uuidv4()}${safeExt}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(new Error(`Invalid MIME type: ${file.mimetype}. Only JPEG, PNG, WebP allowed.`), false);
  }
  cb(null, true);
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
  fileFilter,
});

export const validateImageBuffer = async (req, res, next) => {
  if (!req.file) return next();
  try {
    const buffer = fs.readFileSync(req.file.path);
    const type = await fileTypeFromBuffer(buffer);
    if (!type || !ALLOWED_MIME.has(type.mime)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'File rejected: magic bytes do not match a valid image format.',
        detected: type?.mime ?? 'unknown',
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};