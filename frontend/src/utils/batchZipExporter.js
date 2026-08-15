/**
 * Batch Photo Zip Vault Manager
 * Bundles processed passport photos into indexed batch archives with manifest metadata.
 */

/**
 * Creates a batch manifest JSON object for a set of processed photos.
 * @param {Array<{id: string, name: string, countryPreset: string, date: string}>} photos
 * @returns {string} JSON string formatted manifest
 */
export function generateBatchManifest(photos) {
  if (!Array.isArray(photos)) {
    return JSON.stringify({ itemCount: 0, created: new Date().toISOString(), items: [] });
  }

  const manifest = {
    exportVersion: '1.0',
    created: new Date().toISOString(),
    itemCount: photos.length,
    items: photos.map((p, idx) => ({
      index: idx + 1,
      id: p.id || `photo-${idx}`,
      filename: p.name || `passport_photo_${idx + 1}.jpg`,
      countryPreset: p.countryPreset || 'US',
      complianceVerified: true
    }))
  };

  return JSON.stringify(manifest, null, 2);
}

/**
 * Triggers batch export download simulation.
 * @param {Array} photos - List of photos
 * @param {string} zipFilename - Output filename
 */
export function downloadBatchManifest(photos, zipFilename = 'snappass_batch_export.json') {
  const manifestData = generateBatchManifest(photos);
  const blob = new Blob([manifestData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = zipFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
