// [IMPORTS]
// Mongoose imports
import { Document, Schema, Types, model } from "mongoose";
// Local imports
import Membership from "./Membership";
import Log from "./Logs";

// [INTERFACE]
export interface IMinistry extends Document {
  name: string;
  localChurch: Types.ObjectId;
  members?: Types.ObjectId[];
  customId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// [SCHEMA]
const ministrySchema = new Schema<IMinistry>(
  {
    name: {
      type: String,
      required: [true, "Ministry is required"],
      trim: true,
    },
    localChurch: {
      type: Schema.Types.ObjectId,
      ref: "Local",
      required: [true, "Local Church is required"],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Membership",
      },
    ],
    customId: { type: String, unique: true },
  },
  { timestamps: true }
);

// [EXPORT]
const Ministry = model<IMinistry>("Ministry", ministrySchema);
export default Ministry;
