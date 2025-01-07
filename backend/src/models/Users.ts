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

// Logging middleware for user creation
userSchema.post("save", async function (doc) {
  const userId = doc?._id;
  await Log.create({
    action: "created",
    collection: "User",
    documentId: userId,
    data: doc.toObject(),
    performedBy: doc._id,
    timestamp: new Date(),
  });
});

// Logging middleware for user updates
userSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    // Fetch previous data before update
    const prevData = doc.toObject();

    await Log.create({
      action: "updated",
      collection: "User",
      documentId: doc._id,
      data: { prevData, newData: this.getUpdate() },
      performedBy: this.getQuery()._id,
      timestamp: new Date(),
    });
  }
});

// Logging middleware for user deletion
userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Log.create({
      action: "deleted",
      collection: "User",
      documentId: doc._id,
      data: doc.toObject(),
      performedBy: this.getQuery()._id,
      timestamp: new Date(),
    });
  }
});

// [EXPORT]
const User = model<IUser>("User", userSchema);
export default User;
