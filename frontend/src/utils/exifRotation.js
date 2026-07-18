import imageCompression from 'browser-image-compression';

/**
 * Corrects the image orientation based on EXIF data.
 * It uses browser-image-compression but Configures it to minimize compression 
 * and only apply the EXIF rotation.
 * 
 * @param {File} file - The original image file
 * @returns {Promise<File>} - A new File object with corrected orientation
 */
export async function correctImageOrientation(file) {
  // Only apply to JPEGs and WEBPs since PNGs don't use EXIF orientation
  if (!['image/jpeg', 'image/webp'].includes(file.type)) {
    return file;
  }

  try {
    const options = {
      // Set to an absurdly high limit so we don't accidentally compress or resize it,
      // we only want the EXIF orientation correction.
      maxSizeMB: Math.max(file.size / 1024 / 1024 + 1, 100), // Original file size + 1MB, or 100MB minimum
      maxWidthOrHeight: 8192, // 8K resolution to prevent resizing
      useWebWorker: true,
      exifOrientation: true // This is the default, but we'll be explicit.
    };

    const compressedBlob = await imageCompression(file, options);
    
    // browser-image-compression returns a Blob (or File). Convert it back to a File
    // to maintain compatibility with the rest of the app, preserving the original name.
    const correctedFile = new File([compressedBlob], file.name, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    });

    return correctedFile;
  } catch (error) {
    console.error('Error applying EXIF rotation:', error);
    // If it fails, fallback to the original file
    return file;
  }
}
