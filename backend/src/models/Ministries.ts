// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";

// [DEFINITION]
export interface IMinistry extends Document {
  name: string;
  localChurch: mongoose.Types.ObjectId;
  members?: mongoose.Types.ObjectId[];
}

// [SCHEMA]
const ministrySchema = new Schema<IMinistry>({
  name: {
    type: String,
    required: [true, "Name is required"],
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

// [MODEL]
const Ministry = mongoose.model<IMinistry>("Ministry", ministrySchema);

// [EXPORT]
export default Ministry;
