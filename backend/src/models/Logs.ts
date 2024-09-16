// [IMPORTS]
// Global import
import mongoose, { Schema } from "mongoose";

// [SCHEMA]
const logSchema = new Schema({
  action: {
    type: String,
    enum: ["created", "updated", "deleted"],
    required: true,
  },
  collection: { type: String, required: true },
  documentId: { type: mongoose.Types.ObjectId, required: true },
  data: { type: Schema.Types.Mixed }, // Can store original or updated data
  performedBy: { type: mongoose.Types.ObjectId, ref: "User" }, // Optional
  timestamp: { type: Date, default: Date.now },
});

// [EXPORT]
const Log = mongoose.model("Log", logSchema);
export default Log;
