/**
 * storageJanitor.service.js — Temporary file storage cleanup janitor
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import fs from 'fs/promises';
import path from 'path';

export class StorageJanitorService {
  static async pruneStaleFiles(directoryPath, retentionMs = 3600000) {
    let deletedCount = 0;
    let reclaimedBytes = 0;
    const now = Date.now();

    try {
      const files = await fs.readdir(directoryPath);
      for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.stat(filePath);
        if (now - stats.mtimeMs > retentionMs) {
          reclaimedBytes += stats.size;
          await fs.unlink(filePath);
          deletedCount++;
        }
      }
    } catch (err) {
      console.error(`StorageJanitor error pruning ${directoryPath}:`, err.message);
    }

    return { deletedCount, reclaimedBytes };
  }
}
