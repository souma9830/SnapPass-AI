/**
 * archiveManifest.utils.js — Archive manifest generator.
 */
import crypto from 'crypto';

export const generateArchiveManifest = (files = []) => {
  const manifest = {
    generatedAt: new Date().toISOString(),
    totalFiles: files.length,
    files: files.map((file) => ({
      name: file.name,
      checksum: crypto.createHash('sha256').update(file.buffer || file.name).digest('hex'),
    })),
  };

  return JSON.stringify(manifest, null, 2);
};
