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

export interface IMembership extends Document {
  name: {
    firstname: string;
    middlename: string;
    lastname: string;
    suffix: string;
  };
  address: {
    permanent: IAddress;
    current: IAddress;
  };
  gender: "male" | "female";
  civilStatus: "single" | "married" | "separated" | "widowed";
  birthday: Date;
}

// [SCHEMA]
const addressSchema = new Schema<IAddress>({
  street: { type: String },
  barangay: { type: String },
  town: { type: String },
  city: { type: String },
  province: { type: String },
});

const membershipSchema = new Schema<IMembership>({
  name: {
    firstname: { type: String, required: true },
    middlename: { type: String },
    lastname: { type: String, required: true },
    suffix: { type: String },
  },
  address: {
    permanent: { type: addressSchema, required: true },
    current: { type: addressSchema, required: true },
  },
  gender: { type: String, enum: ["male", "female"], required: true },
  civilStatus: {
    type: String,
    enum: ["single", "married", "separated", "widowed"],
    required: true,
  },
  birthday: { type: Date, required: true },
});

// [EXPORT]
const Membership = mongoose.model<IMembership>("Membership", membershipSchema);

export default Membership;
