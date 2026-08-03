export const PRESET_LIMITS = {
  MIN_DIMENSION_MM: 1,
  MAX_DIMENSION_MM: 500,
  MIN_DPI: 72,
  MAX_DPI: 1200,
  MAX_NAME_LENGTH: 100,
  MAX_LABEL_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_COUNTRIES: 20,
};

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

const toNumber = (value) => {
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? NaN : parsed;
  }
  return value;
};

const roundToHundredth = (value) => Math.round(value * 100) / 100;

/**
 * Validates and sanitizes a preset payload against physical photo constraints.
 *
 * Required fields (name, label, widthMm, heightMm) are only enforced in
 * non-partial mode (used by preset creation). Bounds checks always apply.
 *
 * @param {object} body - Raw request body.
 * @param {{ partial?: boolean }} [options]
 * @returns {{ ok: true, value: object } | { ok: false, errors: string[] }}
 */
export function validateAndSanitizePreset(body, { partial = false } = {}) {
  const source = body && typeof body === 'object' ? body : {};
  const errors = [];
  const sanitized = {};

  const requireString = (key, maxLength) => {
    if (source[key] === undefined || source[key] === null) {
      if (!partial) errors.push(`${key} is required.`);
      return;
    }
    const value = typeof source[key] === 'string' ? source[key].trim() : source[key];
    if (typeof value !== 'string' || value.length === 0) {
      errors.push(`${key} must be a non-empty string.`);
      return;
    }
    if (value.length > maxLength) {
      errors.push(`${key} must not exceed ${maxLength} characters.`);
      return;
    }
    sanitized[key] = value;
  };

  const requireNumber = (key, { min, max }) => {
    if (source[key] === undefined || source[key] === null || source[key] === '') {
      if (!partial) errors.push(`${key} is required.`);
      return;
    }
    const value = toNumber(source[key]);
    if (typeof value !== 'number' || Number.isNaN(value)) {
      errors.push(`${key} must be a valid number.`);
      return;
    }
    if (value < min || value > max) {
      errors.push(`${key} must be between ${min} and ${max}.`);
      return;
    }
    sanitized[key] = roundToHundredth(value);
  };

  requireString('name', PRESET_LIMITS.MAX_NAME_LENGTH);
  requireString('label', PRESET_LIMITS.MAX_LABEL_LENGTH);
  requireNumber('widthMm', {
    min: PRESET_LIMITS.MIN_DIMENSION_MM,
    max: PRESET_LIMITS.MAX_DIMENSION_MM,
  });
  requireNumber('heightMm', {
    min: PRESET_LIMITS.MIN_DIMENSION_MM,
    max: PRESET_LIMITS.MAX_DIMENSION_MM,
  });

  if (source.dpi !== undefined && source.dpi !== null && source.dpi !== '') {
    const dpi = toNumber(source.dpi);
    if (typeof dpi !== 'number' || Number.isNaN(dpi)) {
      errors.push('dpi must be a valid number.');
    } else if (dpi < PRESET_LIMITS.MIN_DPI || dpi > PRESET_LIMITS.MAX_DPI) {
      errors.push(`dpi must be between ${PRESET_LIMITS.MIN_DPI} and ${PRESET_LIMITS.MAX_DPI}.`);
    } else {
      sanitized.dpi = Math.round(dpi);
    }
  }

  if (source.bgColor !== undefined && source.bgColor !== null && source.bgColor !== '') {
    const bgColor = String(source.bgColor).trim();
    if (!HEX_COLOR.test(bgColor)) {
      errors.push('bgColor must be a valid hex color (e.g. #FFFFFF).');
    } else {
      sanitized.bgColor = bgColor.toUpperCase();
    }
  }

  if (source.order !== undefined && source.order !== null && source.order !== '') {
    const order = toNumber(source.order);
    if (typeof order !== 'number' || Number.isNaN(order)) {
      errors.push('order must be a valid number.');
    } else {
      sanitized.order = order;
    }
  }

  if (source.active !== undefined && source.active !== null && source.active !== '') {
    sanitized.active = source.active === true || source.active === 'true';
  }

  if (source.description !== undefined && source.description !== null) {
    const description = String(source.description).trim();
    if (description.length > PRESET_LIMITS.MAX_DESCRIPTION_LENGTH) {
      errors.push(`description must not exceed ${PRESET_LIMITS.MAX_DESCRIPTION_LENGTH} characters.`);
    } else {
      sanitized.description = description;
    }
  }

  if (source.countries !== undefined && source.countries !== null) {
    if (!Array.isArray(source.countries) || source.countries.length > PRESET_LIMITS.MAX_COUNTRIES) {
      errors.push(`countries must be an array of at most ${PRESET_LIMITS.MAX_COUNTRIES} entries.`);
    } else {
      sanitized.countries = source.countries
        .map((country) => String(country).trim())
        .filter(Boolean);
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, value: sanitized };
}
