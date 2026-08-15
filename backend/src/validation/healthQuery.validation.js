/**
 * healthQuery.validation.js — Query validation for health check parameters.
 */

export const validateHealthQuery = (query) => {
  const errors = [];
  if (query.verbose && !['true', 'false'].includes(String(query.verbose).toLowerCase())) {
    errors.push('verbose query parameter must be a boolean.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
