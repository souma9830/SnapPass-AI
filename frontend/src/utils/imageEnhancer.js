/**
 * Image enhancement helper functions to auto-adjust contrast, sharpness, and color tone.
 */

export const autoEnhanceImage = (imageUrl, options = {}) => {
  const { contrast = 1.15, brightness = 15, sharpness = 0.1, saturation = 1.05 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const intercept = 128 * (1 - contrast);

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i] * contrast + intercept + brightness;
        let g = data[i + 1] * contrast + intercept + brightness;
        let b = data[i + 2] * contrast + intercept + brightness;

        // Apply light saturation adjustment
        const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;

        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
};

export const calculateHistogram = (imageData) => {
  const histogram = { r: new Array(256).fill(0), g: new Array(256).fill(0), b: new Array(256).fill(0) };
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    histogram.r[data[i]]++;
    histogram.g[data[i + 1]]++;
    histogram.b[data[i + 2]]++;
  }

  return histogram;
};

export default autoEnhanceImage;

