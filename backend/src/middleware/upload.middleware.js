import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import sharp from 'sharp';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_DIMENSION = 10000;
const MIN_DIMENSION = 200;

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
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(
      new Error(
        `Invalid MIME type: ${file.mimetype}. Only JPEG, PNG, WebP allowed.`
      ),
      false
    );
  }
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return cb(
      new Error(
        `Invalid file extension: ${ext}. Only .jpg, .jpeg, .png, .webp allowed.`
      ),
      false
    );
  }
  cb(null, true);
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
  fileFilter,
});

const validateMagicBytes = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const { fileTypeFromBuffer } = await import('file-type');
  const type = await fileTypeFromBuffer(buffer);
  if (!type || !ALLOWED_MIME.has(type.mime)) {
    return {
      valid: false,
      error: `Magic bytes mismatch. Detected: ${type?.mime ?? 'unknown'}`,
    };
  }
  return { valid: true, mime: type.mime };
};

const validateImageDimensions = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
      return {
        valid: false,
        error: `Image dimensions (${metadata.width}x${metadata.height}) exceed maximum ${MAX_DIMENSION}px`,
      };
    }
    if (metadata.width < MIN_DIMENSION || metadata.height < MIN_DIMENSION) {
      return {
        valid: false,
        error: `Image dimensions (${metadata.width}x${metadata.height}) below minimum ${MIN_DIMENSION}px`,
      };
    }
    return { valid: true, width: metadata.width, height: metadata.height };
  } catch (err) {
    return {
      valid: false,
      error: 'Could not read image metadata. File may be corrupted.',
    };
  }
};

const validateCompressionRatio = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    const stat = fs.statSync(filePath);
    const pixelCount = (metadata.width || 1) * (metadata.height || 1);
    const bytesPerPixel = stat.size / pixelCount;
    if (bytesPerPixel < 0.01) {
      return {
        valid: false,
        error:
          'Suspiciously high compression ratio; file may be corrupt or contain embedded data.',
      };
    }
    return { valid: true };
  } catch {
    return { valid: true };
  }
};

export const validateImageChain = async (req, res, next) => {
  if (!req.file) return next();

  const { path: filePath } = req.file;

  const mbResult = await validateMagicBytes(filePath);
  if (!mbResult.valid) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: mbResult.error });
  }

  const dimResult = await validateImageDimensions(filePath);
  if (!dimResult.valid) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: dimResult.error });
  }

  const crResult = await validateCompressionRatio(filePath);
  if (!crResult.valid) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: crResult.error });
  }

  req.imageMeta = {
    width: dimResult.width,
    height: dimResult.height,
    mime: mbResult.mime,
  };
  next();
};

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
