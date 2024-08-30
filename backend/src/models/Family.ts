// [IMPORTS]
// Mongoose imports
import mongoose, { Document, Schema } from "mongoose";

// [INTERFACE]
export interface IFamily extends Document {
  name: String;
  father?: mongoose.Types.ObjectId;
  mother?: mongoose.Types.ObjectId;
  children?: mongoose.Types.ObjectId[];
  localChurch: mongoose.Types.ObjectId;
}

// [SCHEMA]
const familySchema = new Schema<IFamily>({
  name: { type: String, required: true },
  father: { type: Schema.Types.ObjectId, ref: "Member" },
  mother: { type: Schema.Types.ObjectId, ref: "Member" },
  children: [{ type: Schema.Types.ObjectId, ref: "Member" }],
});

// [EXPORT]
const Family = mongoose.model<IFamily>("Family", familySchema);
export default Family;
