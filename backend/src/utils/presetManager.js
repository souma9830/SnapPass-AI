import { PHOTO_SIZE_DETAILS } from '../controllers/presets.controller.js';

export function validateAndSanitizePreset(presetData = {}) {
  const { name, label, widthMm, heightMm, dpi = 300, bgColor = '#FFFFFF', description = '', countries = [] } = presetData;

  const errors = [];
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  }
  if (!widthMm || Number(widthMm) <= 0 || Number(widthMm) > 500) {
    errors.push('widthMm must be a positive number up to 500mm');
  }
  if (!heightMm || Number(heightMm) <= 0 || Number(heightMm) > 500) {
    errors.push('heightMm must be a positive number up to 500mm');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: name.trim().toLowerCase(),
      label: label ? label.trim() : `${widthMm}×${heightMm} mm Custom`,
      widthMm: Number(widthMm),
      heightMm: Number(heightMm),
      dpi: Number(dpi) || 300,
      bgColor,
      description,
      countries: Array.isArray(countries) ? countries : []
    }
  };
}

export function searchBuiltinPresets(query = '') {
  if (!query) return PHOTO_SIZE_DETAILS;
  const q = query.toLowerCase();
  return PHOTO_SIZE_DETAILS.filter((p) => p.label.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
}
