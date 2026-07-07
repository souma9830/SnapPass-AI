// Strict sanitizer rules to scrub NoSQL injection sequences and dangerous HTML tags
export const cleanInputString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\$/g, '\uFF04') // replaces mongo $ query operators
    .replace(/\./g, '\uFF0E') // replaces mongo dot notation characters
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '') // strips script tags
    .trim();
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = cleanInputString(obj[key]);
      }
    }
  }
  return obj;
};
