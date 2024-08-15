// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";

// [DEFINITION]
export interface ICouncil extends Document {
  officer: string;
  position: string;
  year: number;
}

// [SCHEMA]
const councilSchema = new Schema<ICouncil>({
  officer: { type: String, required: true },
  position: { type: String, required: true },
  year: { type: Number, required: true },
});

// [MODEL]
const Council = mongoose.model<ICouncil>("Council", councilSchema);

// [EXPORT]
export default Council;
