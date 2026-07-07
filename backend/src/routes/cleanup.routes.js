import { Router } from 'express';
import { runOrphanedImagesCleanup } from '../services/cleanup.service.js';

const router = Router();

router.post('/run', (req, res) => {
  const result = runOrphanedImagesCleanup();
  res.json({
    success: true,
    message: `Cleanup job completed. Purged ${result.count} files.`,
    count: result.count
  });
});

export default router;
