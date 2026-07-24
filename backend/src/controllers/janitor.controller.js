import path from 'path';
import { StorageJanitorService } from '../services/storageJanitor.service.js';

export const handleJanitorCleanup = (req, res) => {
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  const result = StorageJanitorService.purgeStaleFiles(uploadsDir, 60);

  res.json({
    success: true,
    message: `Janitor storage cleanup completed.`,
    ...result,
  });
};
