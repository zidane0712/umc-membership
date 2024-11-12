// [IMPORTS]
// Mongoose import
import { Document, Schema, Types, model } from "mongoose";
// Local import
import Log from "./Logs";

// [INTERFACE]
export interface IAttendance extends Document {
  date: Date;
  activityName: string;
  localChurch: Types.ObjectId;
  description: string;
  totalAttendees: number;
  tags: string[];
  customId: string;
}

// [SCHEMA]
const attendanceSchema = new Schema<IAttendance>(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    activityName: {
      type: String,
      required: [true, "Activity name is required"],
      trim: true,
    },
    localChurch: {
      type: Schema.Types.ObjectId,
      ref: "Local",
      required: [true, "Local Church is required"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    totalAttendees: {
      type: Number,
      required: [true, "Total number of attendees is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    customId: { type: String, unique: true },
  },
  { timestamps: true }
);

// [MIDDLEWARE]
attendanceSchema.post("save", async function (doc) {
  const attendanceId = doc?._id;
  await Log.create({
    action: "created",
    collection: "Attendance",
    documentId: attendanceId,
    data: doc.toObject(),
    performedBy: doc._id,
    timestamp: new Date(),
  });
});

attendanceSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    // Fetch previous data before update
    const prevData = doc.toObject();

    await Log.create({
      action: "updated",
      collection: "Attendance",
      documentId: doc._id,
      data: { prevData, newData: this.getUpdate() },
      performedBy: this.getQuery()._id,
      timestamp: new Date(),
    });
  }
});

attendanceSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Log.create({
      action: "deleted",
      collection: "Attendance",
      documentId: doc._id,
      data: doc.toObject(),
      performedBy: this.getQuery()._id,
      timestamp: new Date(),
    });
  }
});

// [EXPORT]
const Attendance = model<IAttendance>("Attendance", attendanceSchema);
export default Attendance;
