/**
 * tokenRevocation.validation.js — Validator for token revocation payloads.
 */

export const validateTokenRevocationRequest = (body) => {
  const errors = [];
  if (!body.tokenId || typeof body.tokenId !== 'string' || body.tokenId.trim().length === 0) {
    errors.push('tokenId is required and must be a non-empty string.');
  }

  if (body.ttlSeconds && (isNaN(body.ttlSeconds) || Number(body.ttlSeconds) <= 0)) {
    errors.push('ttlSeconds must be a positive integer.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
