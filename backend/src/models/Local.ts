// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";

// [DEFINITION]
export interface IAddress {
  number: string;
  street?: string;
  subdivision?: string;
  barangay: string;
  municipality: string;
  province: string;
  postalCode: number;
}

export interface ILocal extends Document {
  name: string;
  address: IAddress;
  district: mongoose.Types.ObjectId;
}

// [SCHEMA]
const addressSchema = new Schema<IAddress>(
  {
    number: { type: String, required: true },
    street: { type: String },
    subdivision: { type: String },
    barangay: { type: String, required: true },
    municipality: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: Number, required: true },
  },
  { _id: false }
);

const localSchema = new Schema<ILocal>({
  name: { type: String, required: true },
  address: { type: addressSchema, required: true },
  district: { type: Schema.Types.ObjectId, ref: "District" },
});

// [MODEL]
const Local = mongoose.model<ILocal>("Local", localSchema);

// [EXPORT]
export default Local;
