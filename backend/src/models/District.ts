// [IMPORTS]
// Mongoose imports
import { Document, Schema, model, Types } from "mongoose";
import Log from "./Logs";

// [INTERFACE]
export interface IDistrict extends Document {
  name: string;
  annualConference: Types.ObjectId;
  customId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// [SCHEMA]
const districtSchema = new Schema<IDistrict>(
  {
    name: {
      type: String,
      required: [true, "District Conference is required"],
      trim: true,
    },
    annualConference: {
      type: Schema.Types.ObjectId,
      ref: "Annual",
      index: true,
      required: [true, "Annual Conference is required"],
      trim: true,
    },
    customId: { type: String, unique: true },
  },
  { timestamps: true }
);

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

districtSchema.post("save", async function (doc) {
  await Log.create({
    action: "created",
    collection: "District",
    documentId: doc._id,
    data: doc.toObject(),
    timestamp: new Date(),
  });
});

districtSchema.post("findOneAndUpdate", async function (doc) {
  await Log.create({
    action: "updated",
    collection: "District",
    documentId: doc._id,
    newData: doc.toObject(),
    timestamp: new Date(),
  });
});

districtSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Log.create({
      action: "deleted",
      collection: "District",
      documentId: doc._id,
      data: doc.toObject(),
      timestamp: new Date(),
    });
  }
});

// [INDEX]
districtSchema.index({ annualConference: 1 });

// [EXPORT]
const District = model<IDistrict>("District", districtSchema);
export default District;
