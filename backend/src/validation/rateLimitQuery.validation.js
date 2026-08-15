/**
 * rateLimitQuery.validation.js — Query validation for rate limit overrides.
 */

export const validateRateLimitQuery = (query) => {
  const errors = [];
  if (query.limit && (isNaN(query.limit) || Number(query.limit) <= 0)) {
    errors.push('limit must be a positive integer.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
