import cron from 'node-cron';
import { cleanOldFiles } from '../utils/cleanup.js';
import path from 'path';

cron.schedule('0 * * * *', () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  cleanOldFiles(uploadsDir, 24 * 60 * 60 * 1000);
});