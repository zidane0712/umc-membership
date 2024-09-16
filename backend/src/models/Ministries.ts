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
}

// [SCHEMA]
const ministrySchema = new Schema<IMinistry>({
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
});

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
  await Log.create({
    action: "created",
    collection: "Ministry",
    documentId: doc._id,
    data: doc.toObject(),
    timestamp: new Date(),
  });
});

ministrySchema.post("findOneAndUpdate", async function (doc) {
  await Log.create({
    action: "updated",
    collection: "Ministry",
    documentId: doc._id,
    newData: doc.toObject(),
    timestamp: new Date(),
  });
});

ministrySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Log.create({
      action: "deleted",
      collection: "Ministry",
      documentId: doc._id,
      data: doc.toObject(),
      timestamp: new Date(),
    });
  }
});

// [EXPORT]
const Ministry = model<IMinistry>("Ministry", ministrySchema);
export default Ministry;
