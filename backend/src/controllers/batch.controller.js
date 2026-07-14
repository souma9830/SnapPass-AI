import * as archiverModule from 'archiver';
const archiver = archiverModule.default || archiverModule;
import path from 'path';
import fs from 'fs';

export async function exportBatch(req, res, next) {
  try {
    const { filenames } = req.body;
    if (!Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({ success: false, message: 'filenames array is required.' });
    }
    if (filenames.length > 50) {
      return res.status(400).json({ success: false, message: 'Maximum 50 files per batch.' });
    }

    const uploadsDir = path.resolve(process.cwd(), 'uploads', 'processed');

    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename="snappass-batch-${Date.now()}.zip"`);

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', (err) => { throw err; });
    archive.pipe(res);

    let added = 0;
    for (const name of filenames) {
      const safe = path.basename(name).replace(/[^a-zA-Z0-9_\-\.]/g, '');
      if (!safe) continue;
      const filePath = path.resolve(uploadsDir, safe);
      const rel = path.relative(uploadsDir, filePath);
      if (rel.startsWith('..') || path.isAbsolute(rel)) continue;
      if (!fs.existsSync(filePath)) continue;
      archive.file(filePath, { name: safe });
      added++;
    }

    if (added === 0) {
      archive.destroy();
      return res.status(404).json({ success: false, message: 'No valid files found to export.' });
    }

    await archive.finalize();
  } catch (err) {
    next(err);
  }
}
