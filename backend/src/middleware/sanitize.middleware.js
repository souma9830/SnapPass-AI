const SENSITIVE_KEYS = new Set(['password', 'token', 'secret', 'apiKey']);

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    let cleaned = value.trim();
    cleaned = cleaned.replace(/<[^>]*>?/gm, '');
    cleaned = cleaned.replace(/[<>"'&]/g, '');
    cleaned = cleaned.replace(/javascript:/gi, '');
    cleaned = cleaned.replace(/on\w+=/gi, '');
    return cleaned;
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    return sanitizeObject(value);
  }
  return value;
};

const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key)) {
      sanitized[key] = value;
    } else {
      sanitized[key] = sanitizeValue(value);
    }
  }
  return sanitized;
};

export const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeValue(req.query[key]);
      }
    }
  }
  if (req.params) {
    for (const key of Object.keys(req.params)) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = sanitizeValue(req.params[key]);
      }
    }
  }
  next();
};
