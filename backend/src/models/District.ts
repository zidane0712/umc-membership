// [IMPORTS]
// Mongoose imports
import mongoose, { Document, Schema, model, Types } from "mongoose";

// [INTERFACE]
export interface IDistrict extends Document {
  name: string;
  annualConference: Types.ObjectId;
}

// [SCHEMA]
const districtSchema = new Schema<IDistrict>({
  name: {
    type: String,
    required: [true, "District Conference is required"],
  },
  annualConference: {
    type: Schema.Types.ObjectId,
    ref: "Annual",
    index: true,
    required: [true, "Annual Conference is required"],
  },
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

// [INDEX]
districtSchema.index({ annualConference: 1 });

// [EXPORT]
const District = model<IDistrict>("District", districtSchema);
export default District;
