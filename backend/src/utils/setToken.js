import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export function setToken(res,user){
    const token = jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role,
    }, config.JWT_SECRET, { expiresIn: '7d' });
    const nodeEnv = config.NODE_ENV || "development";
    const isProduction = nodeEnv === "production";
    // In development we use 'lax' (or 'strict') to avoid SameSite=None requirements.
    const sameSiteOption = isProduction ? "none" : "lax";
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction, // only HTTPS in production
        sameSite: sameSiteOption,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
}