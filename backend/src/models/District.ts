// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";

// [DEFINITION]
export interface IDistrict extends Document {
  name: string;
}

// [SCHEMA]
const districtSchema = new Schema<IDistrict>({
  name: { type: String, required: true },
});

// [MODEL]
const District = mongoose.model<IDistrict>("District", districtSchema);

// [EXPORT]
export default District;
