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
  DISCTRICT = "district",
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
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
        return this.role === Role.DISCTRICT;
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

// Logging middleware
userSchema.post("save", async function (doc) {
  await Log.create({
    action: "created",
    collection: "User",
    documentId: doc._id,
    data: doc.toObject(),
    timestamp: new Date(),
  });
});

userSchema.post("findOneAndUpdate", async function (doc) {
  await Log.create({
    action: "updated",
    collection: "User",
    documentId: doc._id,
    newData: doc.toObject(),
    timestamp: new Date(),
  });
});

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Log.create({
      action: "deleted",
      collection: "User",
      documentId: doc._id,
      data: doc.toObject(),
      timestamp: new Date(),
    });
  }
});

// [EXPORT]
const User = model<IUser>("User", userSchema);
export default User;
