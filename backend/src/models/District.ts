// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";

// [DEFINITION]
export interface IDistrict extends Document {
  name: string;
  annualConference: mongoose.Types.ObjectId;
}

// [SCHEMA]
const districtSchema = new Schema<IDistrict>({
  name: { type: String, required: true },
  annualConference: { type: Schema.Types.ObjectId, ref: "Annual" },
});

// [MODEL]
const District = mongoose.model<IDistrict>("District", districtSchema);

// [EXPORT]
export default District;
