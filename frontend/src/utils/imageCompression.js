const OUTPUT_FORMAT_PREFERENCE = ['image/webp', 'image/jpeg', 'image/png'];

function supportsWebP() {
  if (typeof document === 'undefined') return false;
  const elem = document.createElement('canvas');
  return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    resizeScale = 1.0,
    outputFormat,
  } = options;

  return new Promise((resolve, reject) => {
    if (
      ![
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/heic',
        'image/heif',
      ].includes(file.type)
    ) {
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

        const preferredType =
          outputFormat || (supportsWebP() ? 'image/webp' : 'image/jpeg');

        const finalMime = OUTPUT_FORMAT_PREFERENCE.includes(preferredType)
          ? preferredType
          : 'image/jpeg';

        const outputName = file.name.replace(
          /\.[^.]+$/,
          finalMime === 'image/webp' ? '.webp' : '.jpg'
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Canvas compression failed'));
            resolve(
              new File([blob], outputName, {
                type: finalMime,
                lastModified: Date.now(),
              })
            );
          },
          finalMime,
          quality
        );
      };
    };
  });
};

export const compressImageWithPreview = (file, options = {}) => {
  return compressImage(file, options).then((compressedFile) => {
    const previewUrl = URL.createObjectURL(compressedFile);
    return {
      compressedFile,
      previewUrl,
      originalSize: file.size,
      compressedSize: compressedFile.size,
    };
  });
};

export const estimateCompressionRatio = (file, options = {}) => {
  return compressImage(file, options).then((compressedFile) => ({
    ratio: ((1 - compressedFile.size / file.size) * 100).toFixed(1),
    savedBytes: file.size - compressedFile.size,
  }));
};

export const getCompressedBlob = async (file, options = {}) => {
  const compressed = await compressImage(file, options);
  return compressed;
};
