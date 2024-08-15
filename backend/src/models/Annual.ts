// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";

// [DEFINITION]
export interface IAnnual extends Document {
  annual: string;
}

// [SCHEMA]
const annualSchema = new Schema<IAnnual>({
  annual: { type: String, required: true },
});

// [MODEL]
const Annual = mongoose.model<IAnnual>("Annual", annualSchema);

// [EXPORT]
export default Annual;
