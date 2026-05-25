import AppError from "../utils/errors/AppError.js";

export default function adminMiddleware(req, _res, next) {
  if (req.user?.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }
  next();
}
