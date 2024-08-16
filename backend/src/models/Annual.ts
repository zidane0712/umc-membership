// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";

// [DEFINITION]
export interface IAnnual extends Document {
  name: string;
  episcopalArea: "bea" | "dea" | "mea";
}

// [SCHEMA]
const annualSchema = new Schema<IAnnual>({
  name: { type: String, required: true },
  episcopalArea: { type: String, enum: ["bea", "dea", "mea"], required: true },
});

// [MODEL]
const Annual = mongoose.model<IAnnual>("Annual", annualSchema);

// [EXPORT]
export default Annual;
