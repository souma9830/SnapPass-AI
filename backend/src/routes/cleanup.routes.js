import { Router } from 'express';
import { runOrphanedImagesCleanup } from '../services/cleanup.service.js';
import { CleanupTask } from '../services/cleanupTask.js';
import { config } from '../config/config.js';
import path from 'path';

const router = Router();

router.post('/run', async (req, res) => {
  const result = runOrphanedImagesCleanup();
  
  const uploadsDir = path.resolve(process.cwd(), config.UPLOAD_DIR || 'uploads');
  const maxAgeMs = config.RETENTION_MAX_AGE_MS || 24 * 60 * 60 * 1000;
  await CleanupTask.execute(uploadsDir, maxAgeMs);
  
  res.json({
    success: true,
    message: `Cleanup job completed. Purged ${result.count} files.`,
    count: result.count
  });
});

export default router;
