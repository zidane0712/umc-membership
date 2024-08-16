// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";

// [DEFINITION]
export interface IAnnual extends Document {
  name: string;
}

// [SCHEMA]
const annualSchema = new Schema<IAnnual>({
  name: { type: String, required: true },
});

// [MODEL]
const Annual = mongoose.model<IAnnual>("Annual", annualSchema);

// [EXPORT]
export default Annual;
