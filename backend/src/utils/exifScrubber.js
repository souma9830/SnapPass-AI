import sharp from 'sharp';
import fs from 'fs';

export const stripImageExifData = async (filePath) => {
  try {
    const tempPath = `${filePath}.stripped`;
    await sharp(filePath)
      .rotate() // keeps EXIF auto-rotation if needed before stripping metadata
      .toFile(tempPath);
    
    fs.renameSync(tempPath, filePath);
    return { success: true };
  } catch (err) {
    console.error('[ExifScrubber] Failed to strip EXIF data:', err.message);
    return { success: false, error: err.message };
  }
};
