// [IMPORTS]
// Mongoose imports
import { Document, Schema, Types, model } from "mongoose";
// Local imports
import { IAddress } from "../interfaces/common";
import { addressSchema } from "../schemas/commonSchemas";
import Log from "./Logs";

// [INTERFACE]
export interface ILocal extends Document {
  name: string;
  address: IAddress;
  district: Types.ObjectId;
  contactNo: string;
  anniversaryDate: Date;
  customId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// [SCHEMA]
const localSchema = new Schema<ILocal>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: { type: addressSchema, required: true },
    district: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: [true, "District Conference is required"],
      index: true,
      trim: true,
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
    anniversaryDate: {
      type: Date,
      required: [true, "Anniversary Date is required"],
      index: true,
    },
    customId: { type: String, unique: true },
  },
  { timestamps: true }
);

// [MIDDLEWARE]
localSchema.pre("save", async function (next) {
  const existingLocalChurch = await Local.findOne({
    name: this.name,
    district: this.district,
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
const Local = model<ILocal>("Local", localSchema);
export default Local;
