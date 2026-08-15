/**
 * sessionQuery.validation.js — Query validation for session lookup parameters.
 */

export const validateSessionQuery = (query) => {
  const errors = [];
  if (query.sessionId && typeof query.sessionId !== 'string') {
    errors.push('sessionId must be a string identifier.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
