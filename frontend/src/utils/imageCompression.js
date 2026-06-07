export const compressImage = (file, options = {}) => {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.85, resizeScale = 1.0 } = options;

  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width * resizeScale;
        let height = img.height * resizeScale;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type || 'image/jpeg';
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas compression failed'));
          resolve(new File([blob], file.name, { type: mimeType, lastModified: Date.now() }));
        }, mimeType, quality);
      };
    };
  });
};
