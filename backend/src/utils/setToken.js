import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export function setToken(res,user){
    const token = jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role,
    }, config.JWT_SECRET, { expiresIn: '7d' });
    const isProduction = config.NODE_ENV === "production";
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
}