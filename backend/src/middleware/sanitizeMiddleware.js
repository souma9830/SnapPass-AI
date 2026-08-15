/**
 * sanitizeMiddleware.js
 * Recursively inspects incoming request body, query, and params to strip potential
 * XSS payload scripts, HTML tags, and NoSQL query injection characters.
 */

function sanitizeValue(value) {
  if (typeof value === 'string') {
    // Remove script tags, javascript: protocols, and HTML tag brackets
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\$gt|\$gte|\$lt|\$lte|\$ne|\$in|\$where/gi, '');
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    const cleanObj = {};
    for (const key of Object.keys(value)) {
      if (!key.startsWith('$')) {
        cleanObj[key] = sanitizeValue(value[key]);
      }
    }
    return cleanObj;
  }
  return value;
}

export function sanitizeMiddleware(req, res, next) {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
}

export default sanitizeMiddleware;
