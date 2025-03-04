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

// [EXPORT]
const Attendance = model<IAttendance>("Attendance", attendanceSchema);
export default Attendance;
