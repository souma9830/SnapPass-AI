import fs from 'fs';
import path from 'path';

export class StorageJanitorService {
  static purgeStaleFiles(directoryPath, maxAgeMinutes = 60) {
    if (!fs.existsSync(directoryPath)) return { purged: 0, freedBytes: 0 };

    const files = fs.readdirSync(directoryPath);
    const now = Date.now();
    const maxAgeMs = maxAgeMinutes * 60 * 1000;

    let purged = 0;
    let freedBytes = 0;

    for (const file of files) {
      const fullPath = path.join(directoryPath, file);
      try {
        const stats = fs.statSync(fullPath);
        if (stats.isFile() && now - stats.mtimeMs > maxAgeMs) {
          freedBytes += stats.size;
          fs.unlinkSync(fullPath);
          purged++;
        }
      } catch {
        // Ignore locked files
      }
    }

    return { purged, freedBytes };
  }
}
