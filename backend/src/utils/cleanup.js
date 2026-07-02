import fs from 'fs/promises';
import path from 'path';

export const cleanOldFiles = async (dirPath, maxAgeMs) => {
  try {
    const files = await fs.readdir(dirPath);
    const now = Date.now();
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);
      if (now - stat.mtimeMs > maxAgeMs) {
        await fs.unlink(filePath);
      }
    }
  } catch (err) {
    console.error('Cleanup error:', err);
  }
};