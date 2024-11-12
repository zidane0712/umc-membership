// [IMPORTS]
// Mongoose import
import { Document, Schema, Types, model } from "mongoose";
// Local import
import Log from "./Logs";

// [INTERFACE]
export interface IHistory extends Document {
  date: Date;
  historian: Types.ObjectId;
  localChurch: Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  mediaLink: string[];
  customId: string;
}

// [SCHEMA]
const historySchema = new Schema<IHistory>(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    historian: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Historian is required"],
      trim: true,
    },
    localChurch: {
      type: Schema.Types.ObjectId,
      ref: "Local",
      required: [true, "Local Church is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "History title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "History content is required"],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    mediaLink: [
      {
        type: String,
      },
    ],
    customId: { type: String, unique: true },
  },
  { timestamps: true }
);

// [MIDDLEWARE]
historySchema.post("save", async function (doc) {
  const historyId = doc?._id;
  await Log.create({
    action: "created",
    collection: "History",
    documentId: historyId,
    data: doc.toObject(),
    timestamp: new Date(),
  });
});

historySchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    // Fetch previous data before update
    const prevData = doc.toObject();

    await Log.create({
      action: "updated",
      collection: "History",
      documentId: doc._id,
      data: { prevData, newData: this.getUpdate() },
      performedBy: this.getQuery()._id,
      timestamp: new Date(),
    });
  }
});

historySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Log.create({
      action: "deleted",
      collection: "History",
      documentId: doc._id,
      data: doc.toObject(),
      performedBy: this.getQuery()._id,
      timestamp: new Date(),
    });
  }
});

// [EXPORT]
const History = model<IHistory>("History", historySchema);
export default History;
