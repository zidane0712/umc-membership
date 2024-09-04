// [IMPORT]
// Mongoose import
import { Schema } from "mongoose";

import { IAddress, IBaptismConfirmation, IFamily } from "../interfaces/common";

// [SCHEMAS]
export const addressSchema = new Schema<IAddress>(
  {
    number: { type: String, trim: true },
    street: { type: String, trim: true },
    subdivision: { type: String, trim: true },
    barangay: {
      type: String,
      required: true,
      trim: true,
    },
    municipality: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

export const baptismConfirmationSchema = new Schema<IBaptismConfirmation>(
  {
    year: { type: Number, trim: true },
    minister: { type: String, trim: true },
  },
  {
    _id: false,
  }
);

export const familySchema = new Schema<IFamily>(
  {
    name: { type: String, required: true, trim: true },
    isMember: { type: Boolean, default: false },
  },
  { _id: false }
);
