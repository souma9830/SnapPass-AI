import { getCache, setCache, deleteCache } from "../config/redis.js";
/**
 * @description User Data Access Object (DAO) for interacting with the User collection in MongoDB.
 * @use This module provides functions to find, create, and update user records in the database.
 */
import User from "../models/user.model.js";

export async function findUserByEmail(email) {
    return await User.findOne({ email }).select("+password");
}

export async function createUser(userData) {
    const user = await User.create(userData);
    return user;
}

export async function findUserById(id) {
    const cacheKey = `user:${id}`;
    const cachedUser = await getCache(cacheKey);
    if (cachedUser) {
        return cachedUser;
    }
    const user = await User.findById(id);
    if (user) {
        await setCache(cacheKey, user, 300); // cache user for 5 minutes
    }
    return user;
}

export async function updateUserLastLogin(id) {
    const user = await User.findByIdAndUpdate(id, { lastLoginAt: new Date() }, { returnDocument: "after" });
    await deleteCache(`user:${id}`);
    return user;
}

export async function updateUserPassword(id, newPassword) {
    const user = await User.findById(id).select("+password");
    if (!user) return null;
    user.password = newPassword;
    // user.save() triggers Mongoose pre("save") hooks which automatically hashes the password
    await user.save();
    await deleteCache(`user:${id}`);
    return user;
}