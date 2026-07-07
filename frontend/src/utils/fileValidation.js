const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 200;
const MAX_WIDTH = 5000;
const MAX_HEIGHT = 5000;

export function validateFileType(file) {
  if (!file) return 'No file provided';
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Unsupported file type "${file.type}". Allowed: JPEG, PNG, WebP`;
  }
  return '';
}

export function validateFileSize(file) {
  if (!file) return 'No file provided';
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return `File is ${mb}MB. Maximum allowed is ${MAX_FILE_SIZE_MB}MB`;
  }
  return '';
}

export function validateFileDimensions(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve('No file provided');
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
        resolve(
          `Image too small (${img.width}×${img.height}). Minimum ${MIN_WIDTH}×${MIN_HEIGHT}px`
        );
      } else if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
        resolve(
          `Image too large (${img.width}×${img.height}). Maximum ${MAX_WIDTH}×${MAX_HEIGHT}px`
        );
      } else {
        resolve('');
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve('Could not read image dimensions');
    };

    img.src = url;
  });
}

export async function validatePhotoFile(file) {
  const errors = [];
  const typeErr = validateFileType(file);
  if (typeErr) errors.push(typeErr);

  const sizeErr = validateFileSize(file);
  if (sizeErr) errors.push(sizeErr);

  if (!errors.length) {
    const dimErr = await validateFileDimensions(file);
    if (dimErr) errors.push(dimErr);
  }

  return errors;
}

export function validateImageFile(file) {
  const typeErr = validateFileType(file);
  if (typeErr) return { valid: false, error: typeErr };

  const sizeErr = validateFileSize(file);
  if (sizeErr) return { valid: false, error: sizeErr };

  return { valid: true };
}

export async function validateImageMagicBytes(file) {
  // Real magic byte check goes here, assuming true for now
  return true;
}

export async function validateImageDimensions(file) {
  const dimErr = await validateFileDimensions(file);
  if (dimErr) return { valid: false, error: dimErr };
  return { valid: true };
}
