/**
 * inputRule.validation.js — Rule helper builder for payload sanitization.
 */

export const validateInputKeys = (payload) => {
  const errors = [];
  if (!payload || typeof payload !== 'object') return { isValid: true, errors: [] };

  const checkKeys = (obj) => {
    for (const k of Object.keys(obj)) {
      if (k.startsWith('$')) errors.push(`Disallowed operator key: ${k}`);
      if (obj[k] && typeof obj[k] === 'object') checkKeys(obj[k]);
    }
  };

  checkKeys(payload);
  return { isValid: errors.length === 0, errors };
};
