import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index to automatically remove the document after expiresAt
    },
  },
  {
    timestamps: true,
  }
);

const BlacklistedToken = mongoose.model("BlacklistedToken", blacklistedTokenSchema);

export default BlacklistedToken;
