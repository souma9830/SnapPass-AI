import imageCompression from 'browser-image-compression';

/**
 * Parses EXIF orientation tag directly from JPEG ArrayBuffer.
 * Orientation Values:
 * 1: Normal, 3: 180 deg, 6: 90 deg CW, 8: 270 deg CW
 */
export function getExifOrientation(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  if (view.getUint16(0, false) !== 0xFFD8) return 1; // Not JPEG

  const length = view.byteLength;
  let offset = 2;

  while (offset < length) {
    if (view.getUint16(offset, false) === 0xFFE1) {
      const exifLength = view.getUint16(offset + 2, false);
      if (view.getUint32(offset + 4, false) === 0x45786966) { // 'Exif'
        const littleEndian = view.getUint16(offset + 10, false) === 0x4949;
        const tags = view.getUint16(offset + 18, littleEndian);
        let tagOffset = offset + 20;

        for (let i = 0; i < tags; i++) {
          if (view.getUint16(tagOffset, littleEndian) === 0x0112) {
            return view.getUint16(tagOffset + 8, littleEndian);
          }
          tagOffset += 12;
        }
      }
      offset += 2 + exifLength;
    } else {
      offset += 2 + view.getUint16(offset + 2, false);
    }
  }
  return 1;
}

export async function correctImageOrientation(file) {
  if (!['image/jpeg', 'image/webp'].includes(file.type)) {
    return file;
  }

  try {
    const options = {
      maxSizeMB: Math.max(file.size / 1024 / 1024 + 1, 100),
      maxWidthOrHeight: 8192,
      useWebWorker: true,
      exifOrientation: true,
    };

    const compressedBlob = await imageCompression(file, options);
    return new File([compressedBlob], file.name, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Error applying EXIF rotation:', error);
    return file;
  }
}
