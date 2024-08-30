// [IMPORT]
// Mongoose import
import { Schema } from "mongoose";

import { IAddress, IBaptismConfirmation, IFamily } from "../interfaces/common";

// [SCHEMAS]
export const addressSchema = new Schema<IAddress>(
  {
    number: { type: String },
    street: { type: String },
    subdivision: { type: String },
    barangay: { type: String, required: true },
    municipality: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: Number, required: true },
  },
  { _id: false }
);

export const baptismConfirmationSchema = new Schema<IBaptismConfirmation>(
  {
    year: { type: Number },
    minister: { type: String },
  },
  {
    _id: false,
  }
);

export const familySchema = new Schema<IFamily>(
  {
    name: { type: String, required: true },
    isMember: { type: Boolean, default: false },
  },
  { _id: false }
);
