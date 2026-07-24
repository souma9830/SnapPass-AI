import fs from 'fs';
import path from 'path';

/**
 * BatchZipService — Orchestrates multi-file zip archive generation for passport photo exports.
 */
export class BatchZipService {
  /**
   * Generates a zip archive stream from an array of validated upload filenames.
   * @param {string[]} filenames - Array of safe filenames in the processed upload directory
   * @param {WritableStream} outputStream - Response or file stream to write zip archive
   * @param {Function} [archiverFactory] - Optional archiver factory for testing
   * @returns {Promise<{ count: number, totalBytes: number }>} Result summary
   */
  static async streamZipArchive(filenames, outputStream, archiverFactory = null) {
    if (!Array.isArray(filenames) || filenames.length === 0) {
      throw new Error('Filenames array must contain at least one file.');
    }

    const processedDir = path.resolve(process.cwd(), 'uploads', 'processed');
    let archive;

    if (archiverFactory) {
      archive = archiverFactory('zip', { zlib: { level: 6 } });
    } else {
      const mod = await import('archiver');
      const archiver = mod.default || mod;
      archive = archiver('zip', { zlib: { level: 6 } });
    }

    let addedCount = 0;

    return new Promise((resolve, reject) => {
      for (const name of filenames) {
        const sanitized = path.basename(name).replace(/[^a-zA-Z0-9_\-\.]/g, '');
        if (!sanitized) continue;

        const filePath = path.resolve(processedDir, sanitized);
        const relative = path.relative(processedDir, filePath);

        // Security check for path traversal
        if (relative.startsWith('..') || path.isAbsolute(relative)) continue;

        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: sanitized });
          addedCount++;
        }
      }

      if (addedCount === 0) {
        if (archive && typeof archive.destroy === 'function') archive.destroy();
        return reject(new Error('No valid existing files found in batch request.'));
      }

      archive.on('error', (err) => reject(err));
      outputStream.on('close', () => {
        resolve({ count: addedCount, totalBytes: archive.pointer ? archive.pointer() : 0 });
      });

      archive.pipe(outputStream);
      archive.finalize();
    });
  }
}
