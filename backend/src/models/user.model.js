import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }
    try{
        this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
        throw new Error("Error hashing password");
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error("Error comparing passwords");
    }
};

const User = mongoose.model("User", userSchema);

export default User;
