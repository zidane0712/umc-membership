// [IMPORTS]
// Mongoose imports
import { Document, Schema, model } from "mongoose";
import Log from "./Logs";

// [INTERFACE]
export interface IAnnual extends Document {
  name: string;
  episcopalArea: "bea" | "dea" | "mea";
  customId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// [SCHEMA]
const annualSchema = new Schema<IAnnual>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    episcopalArea: {
      type: String,
      enum: ["bea", "dea", "mea"],
      required: [true, "Episcopal Area is required"],
      trim: true,
    },
    customId: { type: String, unique: true },
  },
  { timestamps: true }
);

// [MIDDLEWARE]
annualSchema.pre("save", async function (next) {
  const existingAnnualConference = await Annual.findOne({
    name: this.name,
    episcopalArea: this.episcopalArea,
  });

  if (existingAnnualConference) {
    const error = new Error(
      "An annual conference with this this name and episcopal area already exists."
    );
    next(error);
  } else {
    next();
  }
});

// [INDEX]
annualSchema.index({ episcopalArea: 1 });

// [EXPORT]
const Annual = model<IAnnual>("Annual", annualSchema);
export default Annual;
