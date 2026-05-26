// admin.middleware.js
// Middleware to ensure the request is made by an admin user.

import AuthError from "../utils/errors/AuthError.js";

export default function adminMiddleware(req, res, next) {
  // authMiddleware should have attached req.user with decoded JWT payload.
  if (!req.user) {
    return next(new AuthError("Authentication required"));
  }
  if (req.user.role !== "admin") {
    return next(new AuthError("Admin privileges required"));
  }
  return next();
}
