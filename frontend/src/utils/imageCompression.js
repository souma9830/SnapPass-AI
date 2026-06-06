/**
 * Compresses an image file client-side using a canvas.
 * @param {File} file - The source image file.
 * @param {object} options - Compression options.
 * @param {number} options.maxWidth - Maximum width of the compressed image.
 * @param {number} options.maxHeight - Maximum height of the compressed image.
 * @param {number} options.quality - Image quality (0.0 to 1.0) for JPEG/WebP.
 * @returns {Promise<File>} - A Promise that resolves to the compressed File object.
 */
export const compressImage = (file, options = {}) => {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.85 } = options;

  return new Promise((resolve, reject) => {
    // Only compress JPEG, PNG, and WebP
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return resolve(file); // Return original file if unsupported
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions keeping aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob and then File
        // Use the original MIME type, defaulting to image/jpeg
        const mimeType = file.type || 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas compression failed'));
            }
            const compressedFile = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          mimeType,
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
