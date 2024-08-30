// [IMPORTS]
// Mongoose imports
import mongoose, { Document, Schema } from "mongoose";

// Local imports
import { IAddress } from "../interfaces/common";
import { addressSchema } from "../schemas/commonSchemas";

// [INTERFACE]
export interface ILocal extends Document {
  name: string;
  address: IAddress;
  district: mongoose.Types.ObjectId;
  annualConference: mongoose.Types.ObjectId;
  contactNo: string;
  anniversaryDate: Date;
}

// [SCHEMA]
const localSchema = new Schema<ILocal>({
  name: { type: String, required: true },
  address: { type: addressSchema, required: true },
  district: {
    type: Schema.Types.ObjectId,
    ref: "District",
    required: true,
  },
  annualConference: {
    type: Schema.Types.ObjectId,
    ref: "Annual",
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return /^09\d{9}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid cellphone number`,
    },
  },
  anniversaryDate: { type: Date, required: true },
});

// [MIDDLEWARE]
localSchema.pre("save", async function (next) {
  const existingLocalChurch = await Local.findOne({
    name: this.name,
    district: this.district,
    annualConference: this.annualConference,
  });

  if (existingLocalChurch) {
    const error = new Error(
      "A local church with this name, district, and annual conference already exists."
    );
    next(error);
  } else {
    next();
  }
});

// [EXPORT]
const Local = mongoose.model<ILocal>("Local", localSchema);
export default Local;
