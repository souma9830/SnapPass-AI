import path from 'path';
import { StorageJanitorService } from '../services/storageJanitor.service.js';
import { validateJanitorQuery } from '../validation/janitorQuery.validation.js';

export const handleJanitorCleanup = (req, res) => {
  const validation = validateJanitorQuery(req.query);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  const maxAgeMinutes = req.query.maxAgeHours ? Number(req.query.maxAgeHours) * 60 : 60;
  const dryRun = req.query.dryRun === 'true';

  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  const result = StorageJanitorService.purgeStaleFiles(uploadsDir, maxAgeMinutes, dryRun);

  res.json({
    success: true,
    message: dryRun ? 'Janitor dry-run scan completed.' : 'Janitor storage cleanup completed.',
    ...result,
  });
};

