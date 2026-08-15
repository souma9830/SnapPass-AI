import AuthError from "../utils/errors/AuthError.js";
import { validateSession } from "../services/session.service.js";
import SecurityAudit from "../models/securityAudit.model.js";
import { tokenRevocationStore } from "../utils/tokenRevocationStore.js";

export default async function authMiddleware(req, res, next) {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        await SecurityAudit.logSecurityEvent({
            action: 'AUTH_FAILED',
            email: 'anonymous',
            ip: req.ip || req.socket?.remoteAddress || '127.0.0.1',
            status: 'FAILURE',
            severity: 'WARNING',
            userAgent: req.headers['user-agent'] || '',
            details: `No token provided for route ${req.method} ${req.originalUrl}`
        }).catch(() => {});
        return next(new AuthError("No authentication token provided"));
    }

    if (tokenRevocationStore.isRevoked(token)) {
        await SecurityAudit.create({
            action: 'AUTH_FAILED',
            email: 'revoked-token',
            ip: req.ip,
            status: 'FAILURE',
            severity: 'WARNING',
            details: 'Attempt to use explicitly revoked JWT token'
        }).catch(() => {});
        return next(new AuthError("Token has been revoked"));
    }

    try {
        const decoded = await validateSession(token);
        if (!decoded) {
            await SecurityAudit.logSecurityEvent({
                action: 'AUTH_FAILED',
                email: 'revoked-session',
                ip: req.ip || req.socket?.remoteAddress || '127.0.0.1',
                status: 'FAILURE',
                severity: 'WARNING',
                userAgent: req.headers['user-agent'] || '',
                details: `Session expired or revoked for route ${req.originalUrl}`
            }).catch(() => {});
            return next(new AuthError("Session has expired or has been revoked"));
        }

        req.user = decoded;
        res.setHeader('X-Authenticated-User', decoded.id || decoded.email || 'authenticated');
        next();
    } catch (error) {
        await SecurityAudit.logSecurityEvent({
            action: 'AUTH_FAILED',
            email: 'invalid-token',
            ip: req.ip || req.socket?.remoteAddress || '127.0.0.1',
            status: 'FAILURE',
            severity: 'CRITICAL',
            userAgent: req.headers['user-agent'] || '',
            details: `Invalid token signature on ${req.originalUrl}: ${error.message}`
        }).catch(() => {});
        return next(new AuthError("Invalid authentication token"));
    }
}