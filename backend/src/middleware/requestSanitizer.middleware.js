import { sanitizePayloadDeep } from '../utils/payloadSanitizer.utils.js';

const sanitizeValue = (val) => {
  if (typeof val === 'string') {
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/\$where/gi, '');
  }
  if (typeof val === 'object' && val !== null) {
    if (Array.isArray(val)) {
      return val.map(sanitizeValue);
    }
    const cleanObj = {};
    for (const key of Object.keys(val)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue; // Prototype pollution protection
      }
      const cleanKey = key.replace(/^\$/, ''); // Prevent NoSQL injection ($gt, $ne, etc)
      cleanObj[cleanKey] = sanitizeValue(val[key]);
    }
    return cleanObj;
  }
  return val;
};

export const deepRequestSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitizePayloadDeep(req.body);
  if (req.query) req.query = sanitizePayloadDeep(req.query);
  if (req.params) req.params = sanitizePayloadDeep(req.params);
  next();
};

