// [IMPORT]
// Global imports
import mongoose, { Schema, Document, Types, model } from "mongoose";
import bcrypt from "bcrypt";
// Local imports
import Log from "./Logs";

// [ENUM]
enum Role {
  ADMIN = "admin",
  LOCAL = "local",
  DISTRICT = "district",
  ANNUAL = "annual",
  NATIONAL = "national",
}

// [INTERFACE]
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: Role;
  localChurch?: Types.ObjectId;
  district?: Types.ObjectId;
  annual?: Types.ObjectId;
  customId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// [SCHEMA]
const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
    localChurch: {
      type: Schema.Types.ObjectId,
      ref: "Local",
      required: function (this: IUser) {
        return this.role === Role.LOCAL;
      },
    },
    district: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: function (this: IUser) {
        return this.role === Role.DISTRICT;
      },
    },
    annual: {
      type: Schema.Types.ObjectId,
      ref: "Annual",
      required: function (this: IUser) {
        return this.role === Role.ANNUAL;
      },
    },
    customId: { type: String, unique: true },
  },
  { timestamps: true }
);

// [MIDDLEWARE]
// Password hashing
userSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// [EXPORT]
const User = model<IUser>("User", userSchema);
export default User;
