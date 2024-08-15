// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";

// [DEFINITION]
export interface IAddress {
  street: string;
  barangay: string;
  town: string;
  city: string;
  province: string;
}

export interface ILocal extends Document {
  local: string;
  address: IAddress;
}

// [SCHEMA]
const addressSchema = new Schema<IAddress>(
  {
    street: { type: String },
    barangay: { type: String },
    town: { type: String },
    city: { type: String },
    province: { type: String },
  },
  { _id: false }
);

const localSchema = new Schema<ILocal>({
  local: { type: String, required: true },
  address: { type: addressSchema, required: true },
});

// [MODEL]
const Local = mongoose.model<ILocal>("Local", localSchema);

// [EXPORT]
export default Local;
