// [IMPORTS]
// Mongoose imports
import { Document, Schema, Types, model } from "mongoose";
import Log from "./Logs";

// [INTERFACE]
export interface IFamily extends Document {
  familyName: string;
  father?: Types.ObjectId;
  mother?: Types.ObjectId;
  weddingDate?: Date;
  children?: Types.ObjectId[];
  localChurch: Types.ObjectId;
  customId: string;
}

// [SCHEMA]
const familySchema = new Schema<IFamily>(
  {
    familyName: {
      type: String,
      required: [true, "Family name is required"],
      trim: true,
    },
    father: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
    },
    mother: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
    },
    weddingDate: {
      type: Date,
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Membership",
      },
    ],
    localChurch: {
      type: Schema.Types.ObjectId,
      ref: "Local",
      required: [true, "Local Church is required"],
      index: true,
    },
    customId: { type: String, unique: true },
  },
  { timestamps: true }
);

// [MIDDLEWARE]
familySchema.post("save", async function (doc) {
  await Log.create({
    action: "created",
    collection: "Family",
    documentId: doc._id,
    data: doc.toObject(),
    timestamp: new Date(),
  });
});

familySchema.post("findOneAndUpdate", async function (doc) {
  await Log.create({
    action: "updated",
    collection: "Family",
    documentId: doc._id,
    newData: doc.toObject(),
    timestamp: new Date(),
  });
});

familySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Log.create({
      action: "deleted",
      collection: "Family",
      documentId: doc._id,
      data: doc.toObject(),
      timestamp: new Date(),
    });
  }
});

// [EXPORT]
const Family = model<IFamily>("Family", familySchema);
export default Family;
