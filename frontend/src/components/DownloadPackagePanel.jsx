import React, { useState } from 'react';
import './DownloadPackagePanel.css';
import { compressImage, generatePdf, createZip, sanitizeFileName } from '../utils/exportHelpers';
import { saveAs } from 'file-saver';

/**
 * DownloadPackagePanel – UI for selecting export options and generating a download package.
 * Supports:
 *  - Compressed single photo (JPEG)
 *  - Printable grid sheet (high‑resolution placeholder)
 *  - Transparent PNG (background‑removed)
 *  - Compliance renamer toggle
 *  - PDF export (single image)
 *  - ZIP bundling when multiple options are selected
 */
export default function DownloadPackagePanel({ processedUrl, originalFileName }) {
  const [options, setOptions] = useState({
    compressed: false,
    printable: false,
    transparent: false,
    rename: false,
    pdf: false,
  });
  const [loading, setLoading] = useState(false);

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchBlob = async (url) => {
    const res = await fetch(url);
    return await res.blob();
  };

  const handleDownload = async () => {
    if (!processedUrl) return alert('No processed image available.');
    setLoading(true);
    try {
      const blobMap = {};
      const baseName = originalFileName ? sanitizeFileName(originalFileName) : 'photo';

      // Load original processed image blob
      const originalBlob = await fetchBlob(processedUrl);

      if (options.compressed) {
        const compressedBlob = await compressImage(originalBlob, 0.8);
        const name = options.rename ? `${baseName}_compressed.jpg` : `${baseName}.jpg`;
        blobMap[name] = compressedBlob;
      }

      if (options.transparent) {
        const name = options.rename ? `${baseName}_transparent.png` : `${baseName}.png`;
        const transparentBlob = await fetchBlob(processedUrl);
        blobMap[name] = transparentBlob;
      }

      if (options.pdf) {
        const pdfBlob = await generatePdf(originalBlob);
        const name = options.rename ? `${baseName}.pdf` : `download.pdf`;
        blobMap[name] = pdfBlob;
      }

      if (options.printable) {
        const name = options.rename ? `${baseName}_sheet.jpg` : `${baseName}_sheet.jpg`;
        const sheetBlob = await fetchBlob(processedUrl);
        blobMap[name] = sheetBlob;
      }

      const selectedCount = Object.keys(blobMap).length;
      if (selectedCount === 0) {
        alert('Select at least one export option.');
        setLoading(false);
        return;
      }

      if (selectedCount === 1) {
        const [fileName, fileBlob] = Object.entries(blobMap)[0];
        saveAs(fileBlob, fileName);
      } else {
        await createZip(blobMap, 'download_package.zip');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to generate package.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="download-package-panel card">
      <h3 className="panel-title">Download Package</h3>
      <div className="options-list">
        <label>
          <input type="checkbox" checked={options.compressed} onChange={() => toggleOption('compressed')} />
          Compressed Photo (JPEG for online forms)
        </label>
        <label>
          <input type="checkbox" checked={options.printable} onChange={() => toggleOption('printable')} />
          Printable Grid Sheet (high‑resolution)
        </label>
        <label>
          <input type="checkbox" checked={options.transparent} onChange={() => toggleOption('transparent')} />
          Transparent PNG (background‑removed)
        </label>
        <label>
          <input type="checkbox" checked={options.rename} onChange={() => toggleOption('rename')} />
          Rename for compliance (e.g., passport_photo.jpg)
        </label>
        <label>
          <input type="checkbox" checked={options.pdf} onChange={() => toggleOption('pdf')} />
          Export as PDF (single image)
        </label>
      </div>
      <button className="btn btn-primary" onClick={handleDownload} disabled={loading}>
        {loading ? 'Processing...' : 'Download Package'}
      </button>
    </div>
  );
}
