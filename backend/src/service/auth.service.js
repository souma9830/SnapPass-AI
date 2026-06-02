/**
 * @description Service layer for authentication-related operations, including user registration, login, and fetching user details.
 * @use This module interacts with the User DAO to perform database operations and handles business logic for authentication.
 */
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail,findUserById,updateUserPassword } from "../dao/user.dao.js";
import AppError from "../utils/errors/AppError.js";
import NotFoundError from "../utils/errors/NotFoundError.js";

export async function registerUser(userData) {
    const { fullName, email, password } = userData;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new AppError("Email already in use", 409);
    }
    const user = await createUser({ fullName, email, password });
    return user;
}

export async function loginUser(email, password) {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }
    return user;
}

export async function getMe(userId) {
    const user = await findUserById(userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return user;
}

export async function getUserByEmail(email) {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return user;
}

export async function updatePassword(userId, newPassword) {
    // Raw password is passed to the DAO; Mongoose pre-save hook in user.model.js automatically hashes it to prevent double-hashing lockouts
    const user = await updateUserPassword(userId, newPassword);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return user;
}