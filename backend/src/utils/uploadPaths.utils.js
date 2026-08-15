import path from 'path';

export function resolveUploadPath(filename) {
  if (!filename || typeof filename !== 'string') {
    return null;
  }
  if (filename.startsWith('.')) {
    return null;
  }
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  const filePath = path.resolve(uploadsDir, filename);
  const relative = path.relative(uploadsDir, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }
  return filePath;
}
