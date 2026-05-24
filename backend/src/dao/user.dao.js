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
    return await User.findById(id);
}

export async function updateUserLastLogin(id) {
    return await User.findByIdAndUpdate(id, { lastLoginAt: new Date() }, { returnDocument: "after" });
}

export async function updateUserPassword(id, newPassword) {
    return await User.findByIdAndUpdate(id, { password: newPassword }, { returnDocument: "after" });
}