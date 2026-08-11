/**
 * Utility for packaging and exporting multi-preset passport photos and metadata manifests.
 */

export const generateBatchManifest = (photoItems, presetName = 'Passport Standard') => {
  return {
    exportedAt: new Date().toISOString(),
    preset: presetName,
    totalFiles: photoItems.length,
    files: photoItems.map((item, idx) => ({
      id: item.id || `photo-${idx + 1}`,
      name: item.name || `passport_photo_${idx + 1}.png`,
      dimensions: item.dimensions || '35x45mm',
      dpi: item.dpi || 300,
      complianceScore: item.complianceScore || 100,
    })),
  };
};

export const downloadBatchJsonManifest = (photoItems, filename = 'passport_batch_manifest.json') => {
  const manifest = generateBatchManifest(photoItems);
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
