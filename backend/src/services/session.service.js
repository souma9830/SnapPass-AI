import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";
import { config } from "../config/config.js";

/**
 * Creates a new session, signs JWT, and saves to database.
 */
export async function createSession(res, user, ipAddress, userAgent) {
  const expiresInDays = 7;
  const maxAgeMs = expiresInDays * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + maxAgeMs);

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    config.JWT_SECRET,
    { expiresIn: `${expiresInDays}d` }
  );

  // Save session info to database
  await Session.create({
    userId: user._id,
    token,
    ipAddress: ipAddress || "unknown",
    userAgent: userAgent || "unknown",
    expiresAt,
    isValid: true,
  });

  const nodeEnv = config.NODE_ENV || "development";
  const isProduction = nodeEnv === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: maxAgeMs,
    path: "/",
  });

  return token;
}

/**
 * Validates the session. If invalid in database, returns false.
 */
export async function validateSession(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const session = await Session.findOne({ token, isValid: true });
    if (!session) return null;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Invalidates (deactivates) a specific session.
 */
export async function invalidateSession(token) {
  await Session.updateOne({ token }, { isValid: false });
}

/**
 * Invalidates all sessions for a specific user.
 */
export async function invalidateAllUserSessions(userId) {
  await Session.updateMany({ userId }, { isValid: false });
}

/**
 * Invalidates a specific session by MongoDB ID.
 */
export async function invalidateSessionById(id, userId) {
  await Session.updateOne({ _id: id, userId }, { isValid: false });
}

/**
 * Invalidates multiple sessions by their MongoDB IDs.
 */
export async function invalidateSessionsByIds(ids, userId) {
  await Session.updateMany({ _id: { $in: ids }, userId }, { isValid: false });
}

/**
 * Retrieves all active sessions for a user.
 */
export async function getActiveSessionsForUser(userId) {
  return Session.find({ userId, isValid: true, expiresAt: { $gt: new Date() } }).select("-token").sort({ updatedAt: -1 });
}
