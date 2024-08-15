// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";

// [DEFINITION]
export interface IMinistry extends Document {
  name: string;
}

// [SCHEMA]
const ministrySchema = new Schema<IMinistry>({
  name: { type: String, required: true },
});

// [MODEL]
const Ministry = mongoose.model<IMinistry>("Ministry", ministrySchema);

// [EXPORT]
export default Ministry;
