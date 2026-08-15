import React, { useEffect, useState } from 'react';
import './ExifMetadataInspector.css';
import { stripExifMetadata } from '../utils/imageCompression';

function ExifMetadataInspector({ file, onFileCleaned, darkMode }) {
  const [metadata, setMetadata] = useState(null);
  const [cleaning, setCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(false);

  useEffect(() => {
    if (!file) return;

    const fileMeta = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'image/jpeg',
      lastModified: new Date(file.lastModified).toLocaleDateString(),
    };

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;

    img.onload = () => {
      setMetadata({
        ...fileMeta,
        dimensions: `${img.naturalWidth} × ${img.naturalHeight} px`,
        aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(2),
        megapixels: ((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(1) + ' MP',
        colorSpace: 'sRGB (Standard)',
        recommendedForICAO: img.naturalWidth >= 600 && img.naturalHeight >= 600 ? 'YES' : 'NO (Low Res)',
      });
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      setMetadata(fileMeta);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleScrubExif = async () => {
    if (!file) return;
    setCleaning(true);
    try {
      const sanitizedFile = await stripExifMetadata(file);
      setCleaned(true);
      if (onFileCleaned) onFileCleaned(sanitizedFile);
    } catch (err) {
      console.error('Failed to scrub EXIF metadata:', err);
    } finally {
      setCleaning(false);
    }
  };

  if (!metadata) return null;

  return (
    <div className={`exif-metadata-inspector ${darkMode ? 'exif-metadata-inspector-dark' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="exif-inspector-title m-0">📷 Photo EXIF & Privacy Metadata</h4>
        <button
          type="button"
          onClick={handleScrubExif}
          disabled={cleaning || cleaned}
          className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors ${
            cleaned
              ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 disabled:opacity-50'
          }`}
        >
          {cleaning ? 'Scrubbing EXIF...' : cleaned ? '✓ EXIF Privacy Cleaned' : '🔒 Scrub EXIF Metadata'}
        </button>
      </div>

      <div className="exif-grid">
        <div className="exif-item">
          <span className="exif-key">File Name</span>
          <span className="exif-val">{metadata.name}</span>
        </div>
        <div className="exif-item">
          <span className="exif-key">Dimensions</span>
          <span className="exif-val">{metadata.dimensions || 'N/A'}</span>
        </div>
        <div className="exif-item">
          <span className="exif-key">File Size</span>
          <span className="exif-val">{metadata.size}</span>
        </div>
        <div className="exif-item">
          <span className="exif-key">Resolution</span>
          <span className="exif-val">{metadata.megapixels || 'N/A'}</span>
        </div>
        <div className="exif-item">
          <span className="exif-key">Aspect Ratio</span>
          <span className="exif-val">{metadata.aspectRatio || 'N/A'}</span>
        </div>
        <div className="exif-item">
          <span className="exif-key">ICAO Print Grade</span>
          <span className={`exif-val ${metadata.recommendedForICAO === 'YES' ? 'val-pass' : 'val-warn'}`}>
            {metadata.recommendedForICAO || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ExifMetadataInspector;
