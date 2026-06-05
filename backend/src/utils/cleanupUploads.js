import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

export function cleanupOldUploads() {
  const expiryTime = 24 * 60 * 60 * 1000; // 24 hours
  const now = Date.now();

  if (!fs.existsSync(UPLOADS_DIR)) {
    return;
  }

  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory for cleanup:', err);
      return;
    }

    files.forEach((file) => {
      // Skip placeholder dummy images or gitkeep files
      if (file === '.gitkeep' || file === 'dummy.jpg') return;

      const filePath = path.join(UPLOADS_DIR, file);
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.error(`Error statting file ${file}:`, statErr);
          return;
        }

        const age = now - stats.mtimeMs;
        if (age > expiryTime) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`Error deleting expired file ${file}:`, unlinkErr);
            } else {
              console.log(`🧹 Cleaned up expired upload file: ${file}`);
            }
          });
        }
      });
    });
  });
}
