/**
 * Image enhancement helper functions to auto-adjust contrast and sharpness values.
 */

export const autoEnhanceImage = (imageUrl) => {
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

      // Enhance contrast by 15% and brightness by flat +15
      const contrast = 1.15;
      const brightness = 15;
      const intercept = 128 * (1 - contrast);

      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * contrast + intercept + brightness;     // R
        data[i+1] = data[i+1] * contrast + intercept + brightness; // G
        data[i+2] = data[i+2] * contrast + intercept + brightness; // B
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
};

export default autoEnhanceImage;
