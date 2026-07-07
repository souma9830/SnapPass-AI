import fs from 'fs';
import path from 'path';

const uploadDir = path.resolve(process.cwd(), 'uploads');

export const runOrphanedImagesCleanup = () => {
  if (!fs.existsSync(uploadDir)) return { success: true, count: 0 };
  
  const files = fs.readdirSync(uploadDir);
  const now = Date.now();
  const maxAgeMs = 24 * 60 * 60 * 1000; // 24 hours
  let deletedCount = 0;

  files.forEach((file) => {
    const filePath = path.join(uploadDir, file);
    try {
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > maxAgeMs) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    } catch (err) {
      console.error(`[CleanupService] Failed to cleanup file ${file}:`, err);
    }
  });

  return { success: true, count: deletedCount };
};
