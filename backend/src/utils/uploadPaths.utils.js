import path from 'path';
import { fileURLToPath } from 'url';

const getDirname = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch (e) {
    // Fallback for CommonJS/Jest transpilation
  }
  return path.resolve(process.cwd(), 'src', 'utils');
};

const __dirname = getDirname();

export function resolveUploadPath(filename) {
  if (!filename || typeof filename !== 'string') {
    return null;
  }
  const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
  const filePath = path.resolve(uploadsDir, filename);
  const relative = path.relative(uploadsDir, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }
  return filePath;
}