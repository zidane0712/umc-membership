// [IMPORT]
import { Schema, Document, model } from "mongoose";

// [INTERFACE]
export interface ICounter extends Document {
  _id: string;
  seq: number;
}

const CounterSchema: Schema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// [EXPORT]
export default model<ICounter>("Counter", CounterSchema);
