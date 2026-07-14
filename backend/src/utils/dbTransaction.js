import mongoose from "mongoose";

/**
 * Executes a callback within a managed MongoDB/Mongoose session transaction.
 * Automatically starts the transaction, commits on success, and aborts/rolls back on error.
 * 
 * @param {Function} callbackFn - Async function to run. Receives the `session` object.
 * @returns {Promise<any>} The result of the callbackFn.
 */
export const runInTransaction = async (callbackFn) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await callbackFn(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    console.error("Mongoose Transaction error. Aborting and rolling back...", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export default runInTransaction;
