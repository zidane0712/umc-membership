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

// [MIDDLEWARE]
ministrySchema.pre("findOneAndDelete", async function (next) {
  const ministryId = this.getQuery()["_id"];

  try {
    await Membership.updateMany(
      { ministries: ministryId },
      { $pull: { ministries: ministryId } }
    );

    next();
  } catch (err) {
    next(err as Error);
  }
});

ministrySchema.post("save", async function (doc) {
  const ministryId = doc?._id;
  await Log.create({
    action: "created",
    collection: "Ministry",
    documentId: doc._id,
    data: doc.toObject(),
    performedBy: doc._id,
    timestamp: new Date(),
  });
});

ministrySchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    // Fetch previous data before update
    const prevData = doc.toObject();

    await Log.create({
      action: "updated",
      collection: "Ministry",
      documentId: doc._id,
      data: { prevData, newData: this.getUpdate() },
      performedBy: this.getQuery()._id,
      timestamp: new Date(),
    });
  }
});

ministrySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Log.create({
      action: "deleted",
      collection: "Ministry",
      documentId: doc._id,
      data: doc.toObject(),
      performedBy: this.getQuery()._id,
      timestamp: new Date(),
    });
  }
});

// [EXPORT]
const Ministry = model<IMinistry>("Ministry", ministrySchema);
export default Ministry;
