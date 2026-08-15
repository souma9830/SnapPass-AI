/**
 * Image Controller
 * Orchestrates calls to the Python AI microservice (rembg and OpenCV face_center.py)
 * for background removal, face detection & centering, and resizing.
 */

import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { config } from "../config/config.js";
import { WebhookService } from "../services/webhook.service.js";
import backgroundQualityRepairService from '../services/backgroundQualityRepair.service.js';

const localFilename = fileURLToPath(import.meta.url);
const localDirname = path.dirname(localFilename);

/**
 * POST /api/process
 * Body: { filename, backgroundColour, photoSizePreset }
 * Calls the AI service /process endpoint and returns processed image URL.
 */
export const processImage = async (req, res, next) => {
  try {
    const { filename, backgroundColour = "white", photoSizePreset = "35x45", attire = "none" } = req.body;

    if (!filename) {
      return res.status(400).json({ success: false, message: "filename is required." });
    }

    const allowedAttires = ["none", "male_suit", "female_blazer", "male_bowtie"];
    if (!allowedAttires.includes(attire)) {
      return res.status(400).json({ success: false, message: "Invalid attire selection." });
    }

    // 1. Filename validation (alphanumeric, dots, hyphens, and underscores only)
    const filenameRegex = /^[a-zA-Z0-9_\-\.]+$/;
    if (!filenameRegex.test(filename)) {
      return res.status(400).json({ success: false, message: "Invalid filename format." });
    }

    // 2. Hidden file blocking
    if (filename.startsWith(".") || path.basename(filename).startsWith(".")) {
      return res.status(403).json({ success: false, message: "Access denied: Hidden files are blocked." });
    }

    // 3. Allowed extension whitelist
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ success: false, message: "Access denied: Unsupported file extension." });
    }

    // 4. Strict directory containment (prevent path traversal completely)
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    const filePath = path.resolve(uploadsDir, filename);

    const relative = path.relative(uploadsDir, filePath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return res.status(403).json({ success: false, message: "Access denied: Path traversal detected." });
    }

    // 5. Async existence, symlink protection & regular file enforcement (non-blocking TOCTOU prevention)
    try {
      const stats = await fs.promises.lstat(filePath);
      if (stats.isSymbolicLink()) {
        return res.status(403).json({ success: false, message: "Access denied: Symbolic links are blocked." });
      }
      if (!stats.isFile()) {
        return res.status(400).json({ success: false, message: "Access denied: Target is not a file." });
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ success: false, message: "File not found on server." });
      }
      throw err;
    }

    // 6. Authorization checks placeholder
    if (req.user && req.user.id) {
      // Future scope: ensure req.user.id has ownership of this uploaded file resource
    }
    // Face quality gate — reject blurry, multi-face, or non-frontal photos early
    try {
      const qualityCheck = await axios.post(`${config.aiServiceUrl}/face-quality-check`, 
        { file_path: filePath },
        { headers: { "Content-Type": "application/json" } }
      );
      if (!qualityCheck.data.passed) {
        return res.status(422).json({
          success: false,
          stage: "face_quality_gate",
          error: {
            code: qualityCheck.data.rejection_code,
            message: qualityCheck.data.rejection_reason,
            user_hint: qualityCheck.data.user_hint,
          }
        });
      }
    } catch (gateError) {
      if (gateError.response?.status === 422) {
        return res.status(422).json(gateError.response.data);
      }
      // If quality gate service is down, fail safe and continue
    }

    // Forward to Python AI service
    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));
    form.append("background_colour", backgroundColour);
    form.append("photo_size_preset", photoSizePreset);
    form.append("attire", attire);

    const shouldCleanupLocal = Boolean(
      config.cloudinary?.cloudName &&
      config.cloudinary?.apiKey &&
      config.cloudinary?.apiSecret
    );

    if (shouldCleanupLocal) {
      res.on("finish", async () => {
        try {
          await fs.promises.unlink(filePath);
        } catch (_error) {
          // Best-effort cleanup, ignore failures.
        }
      });
    }

    const aiResponse = await axios.post(`${config.aiServiceUrl}/remove-bg`, form, {
      headers: form.getHeaders(),
      responseType: "arraybuffer",
    });

    const bgHexMap = { white: '#ffffff', blue: '#2563eb', red: '#dc2626', grey: '#64748b', lightblue: '#93c5fd' };
    const bgHex = bgHexMap[(backgroundColour || 'white').toLowerCase()] || '#ffffff';

    // Apply Background Quality Repair pass (edge smoothing, defringing, noise cleanup)
    const rawBuffer = Buffer.from(aiResponse.data);
    const repairedBuffer = await backgroundQualityRepairService.repairQuality(rawBuffer, {
      refineEdges: true,
      removeHalos: true,
      cleanNoise: true,
      bgHex,
    });

    // Save processed image to disk and return URL
    const processedDir = path.resolve(uploadsDir, 'processed');
    await fs.promises.mkdir(processedDir, { recursive: true });
    const outExt = path.extname(filename).slice(1) || 'png';
    const outFilename = `${path.parse(filename).name}_processed.${outExt}`;
    const outPath = path.join(processedDir, outFilename);
    await fs.promises.writeFile(outPath, repairedBuffer);
    const processedUrl = `/uploads/processed/${outFilename}`;
    res.json({ success: true, data: { processedUrl } });
  } catch (error) {
    // Graceful local sharp processing fallback if AI service is offline
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      try {
        const sharp = (await import('sharp')).default;
        const uploadsDir = path.resolve(process.cwd(), "uploads");
        const filePath = path.resolve(uploadsDir, req.body?.filename || '');
        const processedDir = path.resolve(uploadsDir, 'processed');
        await fs.promises.mkdir(processedDir, { recursive: true });
        const outFilename = `${path.parse(req.body.filename).name}_processed.png`;
        const outPath = path.join(processedDir, outFilename);

        const bgHexMap = { white: '#ffffff', blue: '#2563eb', red: '#dc2626', grey: '#64748b', lightblue: '#93c5fd' };
        const bgHex = bgHexMap[(req.body?.backgroundColour || 'white').toLowerCase()] || '#ffffff';

        await sharp(filePath)
          .flatten({ background: bgHex })
          .resize(600, 800, { fit: 'cover', position: 'center' })
          .png()
          .toFile(outPath);

        const processedUrl = `/uploads/processed/${outFilename}`;
        return res.json({ success: true, data: { processedUrl }, fallback: true });
      } catch (fallbackErr) {
        return res.status(500).json({ success: false, message: "Local photo processing failed." });
      }
    }
    next(error);
  }
};

/**
 * GET /api/process/preview/:filename
 * Returns a lightweight preview of the processed image.
 */
export const getPreview = async (req, res, next) => {
  try {
    const { filename } = req.params;
    res.json({
      success: true,
      data: { filename, previewUrl: `/uploads/processed/${filename}` },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Async job endpoints (real-time preview)
// ─────────────────────────────────────────────────────────────────────────────



import { createJob, getJob, updateJob, getAllJobs, deleteJob } from '../utils/processJobStore.js';

function isAllowedAttire(attire) {
  return ["none", "male_suit", "female_blazer", "male_bowtie"].includes(attire);
}

function safeFileName(filename) {
  if (!filename || typeof filename !== 'string') return null;
  const normalized = filename.replace(/\uFF0E/g, '.');
  const filenameRegex = /^[a-zA-Z0-9_\-\.]+$/;
  if (!filenameRegex.test(normalized)) return null;
  if (normalized.startsWith('.') || path.basename(normalized).startsWith('.')) return null;
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(normalized).toLowerCase();
  if (!allowedExtensions.includes(ext)) return null;
  return normalized;
}

export const createProcessJob = async (req, res, next) => {
  try {
    const {
      filename,
      backgroundColour = 'white',
      photoSizePreset = '35x45',
      attire = 'none',
    } = req.body || {};

    const safeFilename = safeFileName(filename);
    if (!safeFilename) {
      return res.status(400).json({ success: false, message: 'Invalid filename format.' });
    }
    if (!isAllowedAttire(attire)) {
      return res.status(400).json({ success: false, message: 'Invalid attire selection.' });
    }

    const jobId = createJob({
      payload: {
        filename: safeFilename,
        backgroundColour,
        photoSizePreset,
        attire,
      },
    });

    updateJob(jobId, { status: 'processing', progress: 5, stage: 'Initializing' });

    const run = async () => {
      try {
        const job = getJob(jobId);
        if (!job) throw new Error('Job not found');

        const { filename, backgroundColour, photoSizePreset, attire } = job.payload;

        const uploadsDir = path.resolve(process.cwd(), "uploads");
        const filePath = path.resolve(uploadsDir, filename);

        const relative = path.relative(uploadsDir, filePath);
        if (relative.startsWith('..') || path.isAbsolute(relative)) {
          throw new Error('Access denied: Path traversal detected.');
        }

        updateJob(jobId, { progress: 10, stage: 'Validating file' });

        try {
          const qualityCheck = await axios.post(
            `${config.aiServiceUrl}/face-quality-check`,
            { file_path: filePath },
            { headers: { 'Content-Type': 'application/json' } }
          );
          if (!qualityCheck.data.passed) {
            const err = qualityCheck.data;
            throw new Error(err?.error?.message || err?.message || err?.rejection_reason || 'Photo failed compliance checks');
          }
        } catch (gateError) {
          if (gateError?.response?.status === 422) {
            const data = gateError.response.data;
            throw new Error(data?.error?.message || data?.message || 'Photo did not pass quality checks');
          }
        }

        updateJob(jobId, { progress: 25, stage: 'Quality check passed' });

        const uploadForm = new FormData();
        uploadForm.append('image', fs.createReadStream(filePath));
        uploadForm.append('background_colour', backgroundColour);
        uploadForm.append('photo_size_preset', photoSizePreset);
        uploadForm.append('attire', attire);

        updateJob(jobId, { progress: 40, stage: 'Sending to AI service' });

        const aiResponse = await axios.post(`${config.aiServiceUrl}/remove-bg`, uploadForm, {
          headers: uploadForm.getHeaders(),
          responseType: 'arraybuffer',
        });

        updateJob(jobId, { progress: 70, stage: 'AI processing complete' });

        const processedDir = path.resolve(uploadsDir, 'processed');
        await fs.promises.mkdir(processedDir, { recursive: true });
        const outExt = 'png';
        const outFilename = `${path.parse(filename).name}_${jobId}.${outExt}`;
        const outPath = path.join(processedDir, outFilename);
        await fs.promises.writeFile(outPath, Buffer.from(aiResponse.data));

        updateJob(jobId, { progress: 90, stage: 'Saving result' });

        const processedUrl = `/uploads/processed/${outFilename}`;
        updateJob(jobId, { status: 'done', progress: 100, stage: 'Complete', processedUrl });
        await WebhookService.trigger(config.WEBHOOK_URL, 'image.processed', { jobId, processedUrl });

        const shouldCleanupLocal = Boolean(
          config.cloudinary?.cloudName &&
          config.cloudinary?.apiKey &&
          config.cloudinary?.apiSecret
        );
        if (shouldCleanupLocal) {
          try {
            await fs.promises.unlink(filePath);
          } catch (_) {}
        }
      } catch (err) {
        updateJob(jobId, {
          status: 'failed',
          progress: 0,
          stage: 'Failed',
          error: { message: err?.message || 'Processing failed.' },
        });
      }
    };

    Promise.resolve().then(run);

    res.status(202).json({ success: true, data: { jobId } });
  } catch (error) {
    next(error);
  }
};

export const getProcessJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    if (!jobId) return res.status(400).json({ success: false, message: 'jobId is required.' });

    const job = getJob(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    res.json({
      success: true,
      data: {
        status: job.status,
        progress: job.progress,
        stage: job.stage,
        processedUrl: job.processedUrl,
        error: job.error,
        createdAt: job.createdAt,
        payload: job.payload,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const repairImageQualityController = async (req, res, next) => {
  try {
    const {
      filename,
      refineEdges = true,
      removeHalos = true,
      cleanNoise = true,
      backgroundColour = 'white',
    } = req.body || {};

    if (!filename) {
      return res.status(400).json({ success: false, message: 'filename is required.' });
    }

    const cleanFilename = path.basename(filename);
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    const processedDir = path.resolve(uploadsDir, 'processed');

    let filePath = path.resolve(processedDir, cleanFilename);
    if (!fs.existsSync(filePath)) {
      filePath = path.resolve(uploadsDir, cleanFilename);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Target image file not found.' });
    }

    const bgHexMap = { white: '#ffffff', blue: '#2563eb', red: '#dc2626', grey: '#64748b', lightblue: '#93c5fd' };
    const bgHex = bgHexMap[String(backgroundColour).toLowerCase()] || '#ffffff';

    const inputBuffer = await fs.promises.readFile(filePath);
    const repairedBuffer = await backgroundQualityRepairService.repairQuality(inputBuffer, {
      refineEdges: Boolean(refineEdges),
      removeHalos: Boolean(removeHalos),
      cleanNoise: Boolean(cleanNoise),
      bgHex,
    });

    await fs.promises.mkdir(processedDir, { recursive: true });
    const outFilename = `${path.parse(cleanFilename).name}_repaired.png`;
    const outPath = path.join(processedDir, outFilename);
    await fs.promises.writeFile(outPath, repairedBuffer);

    const processedUrl = `/uploads/processed/${outFilename}`;
    return res.json({
      success: true,
      data: {
        processedUrl,
        filename: outFilename,
        repairedOptions: { refineEdges, removeHalos, cleanNoise, backgroundColour },
      },
      message: 'Background quality repair completed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProcessJobs = async (req, res, next) => {
  try {
    const jobsList = getAllJobs().map((job) => ({
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      stage: job.stage,
      processedUrl: job.processedUrl,
      error: job.error,
      createdAt: job.createdAt,
      payload: job.payload,
    }));
    return res.json({ success: true, data: jobsList });
  } catch (error) {
    next(error);
  }
};

export const retryProcessJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const existingJob = getJob(jobId);
    if (!existingJob) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const { filename, backgroundColour = 'white', photoSizePreset = '35x45', attire = 'none' } = existingJob.payload || {};
    updateJob(jobId, { status: 'processing', progress: 5, stage: 'Retrying job', error: null, processedUrl: null });

    const run = async () => {
      try {
        const uploadsDir = path.resolve(process.cwd(), 'uploads');
        const filePath = path.resolve(uploadsDir, filename);

        updateJob(jobId, { progress: 25, stage: 'Validating file' });

        const uploadForm = new FormData();
        uploadForm.append('image', fs.createReadStream(filePath));
        uploadForm.append('background_colour', backgroundColour);
        uploadForm.append('photo_size_preset', photoSizePreset);
        uploadForm.append('attire', attire);

        updateJob(jobId, { progress: 40, stage: 'Sending to AI service' });

        const aiResponse = await axios.post(`${config.aiServiceUrl}/remove-bg`, uploadForm, {
          headers: uploadForm.getHeaders(),
          responseType: 'arraybuffer',
        });

        updateJob(jobId, { progress: 70, stage: 'AI processing complete' });

        const processedDir = path.resolve(uploadsDir, 'processed');
        await fs.promises.mkdir(processedDir, { recursive: true });
        const outFilename = `${path.parse(filename).name}_${jobId}.png`;
        const outPath = path.join(processedDir, outFilename);
        await fs.promises.writeFile(outPath, Buffer.from(aiResponse.data));

        const processedUrl = `/uploads/processed/${outFilename}`;
        updateJob(jobId, { status: 'done', progress: 100, stage: 'Complete', processedUrl });
      } catch (err) {
        updateJob(jobId, {
          status: 'failed',
          progress: 0,
          stage: 'Failed',
          error: { message: err?.message || 'Processing retry failed.' },
        });
      }
    };

    Promise.resolve().then(run);

    return res.json({ success: true, message: 'Job retry initiated.', data: { jobId } });
  } catch (error) {
    next(error);
  }
};

export const cancelOrDeleteProcessJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const existingJob = getJob(jobId);
    if (!existingJob) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    deleteJob(jobId);
    return res.json({ success: true, message: 'Job removed successfully.', data: { jobId } });
  } catch (error) {
    next(error);
  }
};

