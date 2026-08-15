/**
 * payloadSanitizer.utils.js — Deep recursive object sanitizer.
 */

export const sanitizePayloadDeep = (target) => {
  if (typeof target === 'string') {
    return target.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
  }

  if (Array.isArray(target)) {
    return target.map(sanitizePayloadDeep);
  }

  if (target !== null && typeof target === 'object') {
    const cleanObj = {};
    for (const key of Object.keys(target)) {
      if (key.startsWith('$') || key.includes('.')) continue; // Strip potential Mongo query injection keys
      cleanObj[key] = sanitizePayloadDeep(target[key]);
    }
    return cleanObj;
  }

  return target;
};
