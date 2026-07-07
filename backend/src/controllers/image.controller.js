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

    // Save processed image to disk and return URL
    const processedDir = path.resolve(uploadsDir, 'processed');
    await fs.promises.mkdir(processedDir, { recursive: true });
    const outExt = path.extname(filename).slice(1) || 'png';
    const outFilename = `${path.parse(filename).name}_processed.${outExt}`;
    const outPath = path.join(processedDir, outFilename);
    await fs.promises.writeFile(outPath, Buffer.from(aiResponse.data));
    const processedUrl = `/uploads/processed/${outFilename}`;
    res.json({ success: true, data: { processedUrl } });
  } catch (error) {
    // Graceful fallback if AI service is unavailable
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message: "AI service is unavailable. Please ensure python-ai-service is running.",
      });
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



import { createJob, getJob, updateJob } from '../utils/processJobStore.js';

function isAllowedAttire(attire) {
  return ["none", "male_suit", "female_blazer", "male_bowtie"].includes(attire);
}

function safeFileName(filename) {
  const filenameRegex = /^[a-zA-Z0-9_\-\.]+$/;
  if (!filenameRegex.test(filename)) return null;
  if (filename.startsWith('.') || path.basename(filename).startsWith('.')) return null;
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(filename).toLowerCase();
  if (!allowedExtensions.includes(ext)) return null;
  return filename;
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
      },
    });
  } catch (error) {
    next(error);
  }
};

