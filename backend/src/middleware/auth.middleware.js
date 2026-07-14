/**
 * @description Middleware to authenticate users using JWT tokens stored in cookies.
 * @function authMiddleware
 * @returns {void} - Calls the next middleware if authentication is successful, otherwise throws an AuthError.
 * @throws {AuthError} - Throws an error if no token is provided or if the token is invalid.
 */
import AuthError from "../utils/errors/AuthError.js";
import { validateSession } from "../services/session.service.js";
import SecurityAudit from "../models/securityAudit.model.js";

export default async function authMiddleware(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        await SecurityAudit.create({
            action: 'AUTH_FAILED',
            email: 'anonymous',
            ip: req.ip,
            status: 'FAILURE',
            details: 'No token provided'
        }).catch(() => {});
        return next(new AuthError("No token provided"));
    }
    try {
        const decoded = await validateSession(token);
        if (!decoded) {
            await SecurityAudit.create({
                action: 'AUTH_FAILED',
                email: 'revoked-session',
                ip: req.ip,
                status: 'FAILURE',
                details: 'Session has expired or has been revoked'
            }).catch(() => {});
            return next(new AuthError("Session has expired or has been revoked"));
        }
        req.user = decoded;
        next();
    } catch (error) {
        await SecurityAudit.create({
            action: 'AUTH_FAILED',
            email: 'invalid-token',
            ip: req.ip,
            status: 'FAILURE',
            details: 'Invalid token signature'
        }).catch(() => {});
        return next(new AuthError("Invalid token"));
    }
}