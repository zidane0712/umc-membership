// [DEPENDENCIES]
import mongoose, { Document, Schema } from "mongoose";

// [DEFINITION]
export interface IAddress {
  number: string;
  street?: string;
  subdivision?: string;
  barangay: string;
  municipality: string;
  province: string;
  postalCode: number;
}

export interface IBaptismConfirmation {
  year?: number;
  minister?: string;
}

export interface IFamily {
  name: string;
  isMember: boolean;
}

export interface IMembership extends Document {
  name: {
    firstname: string;
    middlename: string;
    lastname: string;
    suffix: string;
  };
  address: {
    permanent: IAddress;
    current: IAddress;
  };
  gender: "male" | "female";
  civilStatus: "single" | "married" | "separated" | "widowed";
  birthday: Date;
  age: number;
  contactNo: string;
  baptism: IBaptismConfirmation;
  confirmation: IBaptismConfirmation;
  father?: IFamily;
  mother?: IFamily;
  spouse?: IFamily;
  children?: IFamily[];
  membershipClassification:
    | "baptized"
    | "professing"
    | "affiliate"
    | "associate"
    | "constituent";
  isActive: boolean;
  organization: "umm" | "umwscs" | "umyaf" | "umyf" | "umcf";
  ministries?: mongoose.Types.ObjectId[];
  council?: mongoose.Types.ObjectId[];
  annualConference: mongoose.Types.ObjectId;
  district: mongoose.Types.ObjectId;
  localChurch: mongoose.Types.ObjectId;
}

// [SCHEMA]
const addressSchema = new Schema<IAddress>(
  {
    number: { type: String, required: true },
    street: { type: String },
    subdivision: { type: String },
    barangay: { type: String, required: true },
    municipality: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: Number, required: true },
  },
  { _id: false }
);

const baptismConfirmationSchema = new Schema<IBaptismConfirmation>(
  {
    year: { type: Number },
    minister: { type: String },
  },
  {
    _id: false,
  }
);

const familySchema = new Schema<IFamily>(
  {
    name: { type: String, required: true },
    isMember: { type: Boolean, default: false },
  },
  { _id: false }
);

const membershipSchema = new Schema<IMembership>({
  name: {
    firstname: { type: String, required: true },
    middlename: { type: String },
    lastname: { type: String, required: true },
    suffix: { type: String },
  },
  address: {
    permanent: { type: addressSchema, required: true },
    current: { type: addressSchema, required: true },
  },
  gender: { type: String, enum: ["male", "female"], required: true },
  civilStatus: {
    type: String,
    enum: ["single", "married", "separated", "widowed"],
    required: true,
  },
  birthday: { type: Date, required: true },
  age: { type: Number },
  contactNo: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return /^09\d{9}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid cellphone number`,
    },
  },
  baptism: {
    type: baptismConfirmationSchema,
    required: true,
    validate: {
      validator: function (value: IBaptismConfirmation) {
        return value.year !== undefined || value.minister !== undefined;
      },
      message:
        "Either year of baptism or officiating minister must be provided.",
    },
  },
  confirmation: {
    type: baptismConfirmationSchema,
    required: true,
    validate: {
      validator: function (value: IBaptismConfirmation) {
        return value.year !== undefined || value.minister !== undefined;
      },
      message:
        "Either year of confirmation or officiating minister must be provided.",
    },
  },
  father: { type: familySchema },
  mother: { type: familySchema },
  spouse: { type: familySchema },
  children: { type: [familySchema] },
  membershipClassification: {
    type: String,
    enum: ["baptized", "professing", "affiliate", "associate", "constituent"],
    required: true,
  },
  isActive: { type: Boolean, default: false },
  organization: {
    type: String,
    enum: ["umm", "umwscs", "umyaf", "umyf", "umcf"],
  },
  ministries: [{ type: Schema.Types.ObjectId, ref: "Ministry" }],
  council: [{ type: Schema.Types.ObjectId, ref: "Council" }],
  annualConference: {
    type: Schema.Types.ObjectId,
    ref: "Annual",
    required: true,
  },
  district: { type: Schema.Types.ObjectId, ref: "District", required: true },
  localChurch: { type: Schema.Types.ObjectId, ref: "Local", required: true },
});

// [PRE-SAVE MIDDLEWARE]
membershipSchema.pre("save", function (next) {
  // Age
  const today = new Date();
  const birthDate = new Date(this.birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  this.age = age;

  // Organization
  if (this.age > 40) {
    this.organization = this.gender === "male" ? "umm" : "umwscs";
  } else if (this.age <= 40 && this.age > 24) {
    this.organization = "umyaf";
  } else if (this.age <= 24 && this.age > 12) {
    this.organization = "umyf";
  } else if (this.age <= 12) {
    this.organization = "umcf";
  }

  next();
});

// [MODEL]
const Membership = mongoose.model<IMembership>("Membership", membershipSchema);

// [EXPORT]
export default Membership;
