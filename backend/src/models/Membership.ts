// [IMPORTS]
// Mongoose imports
import { model, Document, Schema, Types } from "mongoose";

// Local imports
import { IAddress, IBaptismConfirmation, IFamily } from "../interfaces/common";
import {
  addressSchema,
  baptismConfirmationSchema,
  familySchema,
} from "../schemas/commonSchemas";

// [ENUM]
enum Gender {
  Male = "male",
  Female = "female",
}

enum CivilStatus {
  Single = "single",
  Married = "married",
  Separated = "separated",
  widowed = "widowed",
}

enum MembershipClassification {
  Baptized = "baptized",
  Professing = "professing",
  Affiliate = "affiliate",
  Associate = "associate",
  Constituent = "constituent",
}

enum Organization {
  UMM = "umm",
  UMWSCS = "umwscs",
  UMYAF = "umyaf",
  UMYF = "umyf",
  UMCF = "umcf",
}

// [INTERFACE]
export interface IMembership extends Document {
  name: {
    firstname: string;
    middlename?: string;
    lastname: string;
    suffix?: string;
  };
  address: {
    permanent: IAddress;
    current: IAddress;
  };
  gender: Gender;
  civilStatus: CivilStatus;
  birthday: Date;
  age: number;
  contactNo: string;
  baptism: IBaptismConfirmation;
  confirmation: IBaptismConfirmation;
  father?: IFamily;
  mother?: IFamily;
  spouse?: IFamily;
  children?: IFamily[];
  membershipClassification: MembershipClassification;
  isActive: boolean;
  organization: Organization;
  ministries?: Types.ObjectId[];
  annualConference: Types.ObjectId;
  district: Types.ObjectId;
  localChurch: Types.ObjectId;
}

// [SCHEMA]
const membershipSchema = new Schema<IMembership>({
  name: {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    middlename: {
      type: String,
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
    },
    suffix: {
      type: String,
    },
  },
  address: {
    permanent: {
      type: addressSchema,
      required: [true, "Permanent address is required"],
    },
    current: {
      type: addressSchema,
      required: [true, "Current address is required"],
    },
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Gender is required"],
    index: true,
  },
  civilStatus: {
    type: String,
    enum: ["single", "married", "separated", "widowed"],
    required: [true, "Civil status is required"],
    index: true,
  },
  birthday: {
    type: Date,
    required: [true, "Birth date is required"],
    index: true,
  },
  age: {
    type: Number,
    index: true,
  },
  contactNo: {
    type: String,
    required: [true, "Contact number is required"],
    validate: {
      validator: function (v: string) {
        return /^09\d{9}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid cellphone number`,
    },
  },
  baptism: {
    type: baptismConfirmationSchema,
    required: [true, "Baptism information is required"],
    validate: {
      validator: function (value: IBaptismConfirmation) {
        return value.year !== undefined || value.minister !== undefined;
      },
      message:
        "Either year of baptism or officiating minister must be provided.",
    },
    index: true,
  },
  confirmation: {
    type: baptismConfirmationSchema,
    required: [true, "Confirmation information is required"],
    validate: {
      validator: function (value: IBaptismConfirmation) {
        return value.year !== undefined || value.minister !== undefined;
      },
      message:
        "Either year of confirmation or officiating minister must be provided.",
    },
    index: true,
  },
  father: {
    type: familySchema,
  },
  mother: {
    type: familySchema,
  },
  spouse: {
    type: familySchema,
  },
  children: {
    type: [familySchema],
  },
  membershipClassification: {
    type: String,
    enum: ["baptized", "professing", "affiliate", "associate", "constituent"],
    required: [true, "Membership classification is required"],
    index: true,
  },
  isActive: {
    type: Boolean,
    default: false,
    index: true,
  },
  organization: {
    type: String,
    enum: ["umm", "umwscs", "umyaf", "umyf", "umcf"],
    index: true,
  },
  ministries: [
    {
      type: Schema.Types.ObjectId,
      ref: "Ministry",
    },
  ],
  annualConference: {
    type: Schema.Types.ObjectId,
    ref: "Annual",
    required: [true, "Annual Conference is required"],
    index: true,
  },
  district: {
    type: Schema.Types.ObjectId,
    ref: "District",
    required: [true, "District Conference is required"],
    index: true,
  },
  localChurch: {
    type: Schema.Types.ObjectId,
    ref: "Local",
    required: [true, "Local Church is required"],
    index: true,
  },
});

// [PRE-SAVE MIDDLEWARE]
membershipSchema.pre("save", async function (next) {
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
    this.organization =
      this.gender === "male" ? Organization.UMM : Organization.UMWSCS;
  } else if (this.age <= 40 && this.age > 24) {
    this.organization = Organization.UMYAF;
  } else if (this.age <= 24 && this.age > 12) {
    this.organization = Organization.UMYF;
  } else if (this.age <= 12) {
    this.organization = Organization.UMCF;
  }

  // Duplicate Check
  const existingMembership = await Membership.findOne({
    name: this.name,
    district: this.district,
    annualConference: this.annualConference,
  });

  if (existingMembership) {
    const error = new Error(
      "A membership with this name, district, and annual conference already exists."
    );
  }

  next();
});

// [INDEX]
// Single use indexes
membershipSchema.index({ gender: 1 });
membershipSchema.index({ civilStatus: 1 });
membershipSchema.index({ birthday: 1 });
membershipSchema.index({ age: 1 });
membershipSchema.index({ membershipClassification: 1 });
membershipSchema.index({ isActive: 1 });
membershipSchema.index({ organization: 1 });
membershipSchema.index({ annualConference: 1 });
membershipSchema.index({ district: 1 });
membershipSchema.index({ localChurch: 1 });

//Composite indexes
membershipSchema.index({ name: 1, district: 1, annualConference: 1 });

// [EXPORT]
const Membership = model<IMembership>("Membership", membershipSchema);
export default Membership;
