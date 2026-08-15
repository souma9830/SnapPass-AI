/**
 * janitorQuery.validation.js — Query validator for storage cleanup requests.
 */

export const validateJanitorQuery = (query) => {
  const errors = [];
  if (query.maxAgeHours && (isNaN(query.maxAgeHours) || Number(query.maxAgeHours) <= 0)) {
    errors.push('maxAgeHours must be a positive number.');
  }

  if (query.dryRun && !['true', 'false'].includes(String(query.dryRun).toLowerCase())) {
    errors.push('dryRun must be a boolean flag.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
