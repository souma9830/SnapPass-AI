import mongoSanitize from "express-mongo-sanitize";

// Helper to recursively strip HTML tags from strings
const cleanHtmlTags = (val) => {
  if (typeof val === "string") {
    return val.replace(/<[^>]*>/g, "").trim();
  }
  if (Array.isArray(val)) {
    return val.map(cleanHtmlTags);
  }
  if (typeof val === "object" && val !== null) {
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        val[key] = cleanHtmlTags(val[key]);
      }
    }
  }
  return val;
};

export const sanitizeInput = (req, res, next) => {
  // Apply mongo sanitize on body, params, headers, query
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.query);
  mongoSanitize.sanitize(req.params);

  // Apply custom HTML XSS cleaning
  if (req.body) req.body = cleanHtmlTags(req.body);
  if (req.query) req.query = cleanHtmlTags(req.query);
  if (req.params) req.params = cleanHtmlTags(req.params);

  next();
};
