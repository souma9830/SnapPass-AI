import authMiddleware from './auth.middleware.js';
import { config } from '../config/config.js';

/**
 * Wraps authMiddleware so that upload/process routes are protected only
 * when REQUIRE_AUTH_FOR_UPLOADS=true (see #1484). When disabled, requests
 * pass through unauthenticated so the demo frontend (no real sign-in flow)
 * keeps working. When enabled, an authenticated request additionally gets
 * req.user populated.
 */
export default async function optionallyAuthenticated(req, res, next) {
  if (!config.requireAuthForUploads) return next();
  return authMiddleware(req, res, next);
}
