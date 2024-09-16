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
      index: true,
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

annualSchema.post("save", async function (doc) {
  await Log.create({
    action: "created",
    collection: "Annual",
    documentId: doc._id,
    data: doc.toObject(),
    timestamp: new Date(),
  });
});

annualSchema.post("findOneAndUpdate", async function (doc) {
  await Log.create({
    action: "updated",
    collection: "Annual",
    documentId: doc._id,
    newData: doc.toObject(),
    timestamp: new Date(),
  });
});

annualSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Log.create({
      action: "deleted",
      collection: "Annual",
      documentId: doc._id,
      data: doc.toObject(),
      timestamp: new Date(),
    });
  }
});

// [INDEX]
annualSchema.index({ episcopalArea: 1 });

// [EXPORT]
const Annual = model<IAnnual>("Annual", annualSchema);
export default Annual;
