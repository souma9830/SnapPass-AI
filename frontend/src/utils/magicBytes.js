const JPEG_SIG = [0xFF, 0xD8, 0xFF];
const PNG_SIG = [0x89, 0x50, 0x4E, 0x47];
const WEBP_SIG_1 = [0x52, 0x49, 0x46, 0x46]; // "RIFF"
const WEBP_SIG_2 = [0x57, 0x45, 0x42, 0x50]; // "WEBP"
const GIF_SIG = [0x47, 0x49, 0x46, 0x38]; // "GIF8"

export function readFileBytes(file, byteCount = 16) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        reject(new Error('Empty file'));
        return;
      }
      resolve(new Uint8Array(arrayBuffer.slice(0, byteCount)));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function matchSignature(bytes, sig, offset = 0) {
  if (bytes.length < offset + sig.length) return false;
  for (let i = 0; i < sig.length; i++) {
    if (bytes[offset + i] !== sig[i]) return false;
  }
  return true;
}

export function detectImageFormat(bytes) {
  if (matchSignature(bytes, JPEG_SIG)) return 'jpeg';
  if (matchSignature(bytes, PNG_SIG)) return 'png';
  if (matchSignature(bytes, GIF_SIG)) return 'gif';
  if (bytes.length >= 12) {
    if (matchSignature(bytes, WEBP_SIG_1) && matchSignature(bytes, WEBP_SIG_2, 8)) {
      return 'webp';
    }
  }
  return null;
}

export async function validateFileMagicBytes(file) {
  try {
    const bytes = await readFileBytes(file, 16);
    const format = detectImageFormat(bytes);
    if (!format) {
      return { valid: false, format: null, error: 'Unrecognized image file signature.' };
    }
    return { valid: true, format, error: null };
  } catch (err) {
    return { valid: false, format: null, error: err.message };
  }
}
