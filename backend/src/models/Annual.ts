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

annualSchema.post("save", async function (doc) {
  const annualId = doc?._id;
  await Log.create({
    action: "created",
    collection: "Annual",
    documentId: annualId,
    data: doc.toObject(),
    performedBy: doc._id,
    timestamp: new Date(),
  });
});

annualSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    // Fetch previous data before update
    const prevData = doc.toObject();

    await Log.create({
      action: "updated",
      collection: "Annual",
      documentId: doc._id,
      data: { prevData, newData: this.getUpdate() },
      performedBy: this.getQuery()._id,
      timestamp: new Date(),
    });
  }
});

annualSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Log.create({
      action: "deleted",
      collection: "Annual",
      documentId: doc._id,
      data: doc.toObject(),
      performedBy: this.getQuery()._id,
      timestamp: new Date(),
    });
  }
});

// [INDEX]
annualSchema.index({ episcopalArea: 1 });

// [EXPORT]
const Annual = model<IAnnual>("Annual", annualSchema);
export default Annual;
