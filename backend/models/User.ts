import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  name: string;
  dob: string;
  email: string;
  otp?: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  email: { type: String, required: true },
  otp: { type: String },
});

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {name:this.name, email: this.email },
    process.env.JWT_SECRET_KEY!,
    { expiresIn: "1h" }
  );
};

export const User = mongoose.model<IUser>("User", userSchema);
