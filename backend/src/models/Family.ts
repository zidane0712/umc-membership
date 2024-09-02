// [IMPORTS]
// Mongoose imports
import { Document, Schema, Types, model } from "mongoose";

// [INTERFACE]
export interface IFamily extends Document {
  name: String;
  father?: Types.ObjectId;
  mother?: Types.ObjectId;
  children?: Types.ObjectId[];
  localChurch: Types.ObjectId;
}

// [SCHEMA]
const familySchema = new Schema<IFamily>({
  name: {
    type: String,
    required: true,
  },
  father: {
    type: Schema.Types.ObjectId,
    ref: "Member",
  },
  mother: {
    type: Schema.Types.ObjectId,
    ref: "Member",
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
});

// [EXPORT]
const Family = model<IFamily>("Family", familySchema);
export default Family;
