// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";
import Membership from "./Membership";

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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Local",
    required: [true, "Local Church is required"],
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
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

// [MODEL]
const Ministry = mongoose.model<IMinistry>("Ministry", ministrySchema);

// [EXPORT]
export default Ministry;
