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

// [MIDDLEWARE]
districtSchema.pre("save", async function (next) {
  const existingDistrictConference = await District.findOne({
    name: this.name,
    annualConference: this.annualConference,
  });

  if (existingDistrictConference) {
    const error = new Error(
      "A district conference with this name and annual conference already exists."
    );
    next(error);
  } else {
    next();
  }
});

// [MODEL]
const District = mongoose.model<IDistrict>("District", districtSchema);

// [EXPORT]
export default District;
