/**
 * @description Middleware to authenticate users using JWT tokens stored in cookies.
 * @function authMiddleware
 * @returns {void} - Calls the next middleware if authentication is successful, otherwise throws an AuthError.
 * @throws {AuthError} - Throws an error if no token is provided or if the token is invalid.
 */
import AuthError from "../utils/errors/AuthError.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export default function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return next(new AuthError("No token provided"));
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AuthError("Invalid token"));
    }
}