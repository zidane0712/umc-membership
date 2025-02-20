// [IMPORTS]
// Mongoose imports
import { Document, Schema, Types, model } from "mongoose";
import Log from "./Logs";

// [INTERFACE]
export interface IAdministrativeOffice {
  chairperson: Types.ObjectId;
  layLeader: Types.ObjectId;
  layDelegate: Types.ObjectId;
  recordingSecretary: Types.ObjectId;
  membershipSecretary: Types.ObjectId;
  assistantSecretary: Types.ObjectId;
  spprcChairperson: Types.ObjectId;
  botChairperson: Types.ObjectId;
  viceChairperson: Types.ObjectId;
  umyfPresident: Types.ObjectId;
  umyafPresident: Types.ObjectId;
  umwPresident: Types.ObjectId;
  ummPresident: Types.ObjectId;
}

export interface INurture {
  chairperson: Types.ObjectId;
  worship: Types.ObjectId;
  assistant: Types.ObjectId;
  sundaySchool: Types.ObjectId;
  christianEducation: Types.ObjectId;
  stewardship: Types.ObjectId;
  members: Types.ObjectId[];
}

export interface IOutreach {
  chairperson: Types.ObjectId;
  viceChairperson: Types.ObjectId;
  members: Types.ObjectId[];
}

export interface IWitness {
  chairperson: Types.ObjectId;
  viceChairperson: Types.ObjectId;
  membershipCare: Types.ObjectId;
  members: Types.ObjectId[];
}

export interface IChurchHistorian {
  chairperson: Types.ObjectId;
  assistant: Types.ObjectId;
}

export interface ICommunication {
  chairperson: Types.ObjectId;
  assistant: Types.ObjectId;
  members: Types.ObjectId[];
}

export interface IFinance {
  financeChairperson: Types.ObjectId;
  treasurer: Types.ObjectId;
  auditor: Types.ObjectId;
  financeSecretary: Types.ObjectId;
  members: Types.ObjectId[];
}

export interface ICouncil extends Document {
  startYear: Date;
  endYear: Date;
  localChurch: Types.ObjectId;
  administrativeOffice: IAdministrativeOffice;
  nurture: INurture;
  outreach: IOutreach;
  witness: IWitness;
  churchHistorian: IChurchHistorian;
  communications: ICommunication;
  finance: IFinance;
  customId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// [SCHEMA]
const administrativeOfficeSchema = new Schema<IAdministrativeOffice>(
  {
    chairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Council Chairperson is required"],
    },
    layLeader: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Lay Leader is required"],
    },
    layDelegate: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Lay Delegate is required"],
    },
    recordingSecretary: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Recording Secretary is required"],
    },
    membershipSecretary: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Membership Secretary is required"],
    },
    assistantSecretary: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Assistant Secretary is required"],
    },
    spprcChairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "SPPRC Chairperson is required"],
    },
    botChairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "BOT Chairperson is required"],
    },
    viceChairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "ViceChairperson is required"],
    },
    umyfPresident: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "UMYF President is required"],
    },
    umyafPresident: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "UMYAF President is required"],
    },
    umwPresident: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "UMW President is required"],
    },
    ummPresident: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "UMM President is required"],
    },
  },
  {
    _id: false,
  }
);

const nurtureSchema = new Schema<INurture>(
  {
    chairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Nurture Chairperson is required"],
    },
    worship: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Worship Chairperson is required"],
    },
    assistant: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Nurture Assistant is required"],
    },
    sundaySchool: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Sunday School Superintendent is required"],
    },
    christianEducation: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "CE Chairperson is required"],
    },
    stewardship: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Stewardship Chairperson is required"],
    },
    members: [{ type: Schema.Types.ObjectId, ref: "Membership" }],
  },
  {
    _id: false,
  }
);

const outreachSchema = new Schema<IOutreach>(
  {
    chairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Outreach Chairperson is required"],
    },
    viceChairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Outreach Vice Chairperson is required"],
    },
    members: [{ type: Schema.Types.ObjectId, ref: "Membership" }],
  },
  {
    _id: false,
  }
);

const witnessSchema = new Schema<IWitness>(
  {
    chairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Witness Chairperson is required"],
    },
    viceChairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Witness Vice Chairperson is required"],
    },
    membershipCare: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Membership Care Chairperson is required"],
    },
    members: [{ type: Schema.Types.ObjectId, ref: "Membership" }],
  },
  {
    _id: false,
  }
);

const churchHistorianSchema = new Schema<IChurchHistorian>(
  {
    chairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Church Historian is required"],
    },
    assistant: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Church History Assistant is required"],
    },
  },
  {
    _id: false,
  }
);

const communicationsSchema = new Schema<ICommunication>(
  {
    chairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Communications Chairperson is required"],
    },
    assistant: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Communications Assistant is required"],
    },
    members: [{ type: Schema.Types.ObjectId, ref: "Membership" }],
  },
  {
    _id: false,
  }
);

const financeSchema = new Schema<IFinance>(
  {
    financeChairperson: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Finance Chairperson is required"],
    },
    treasurer: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Treasurer is required"],
    },
    auditor: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Auditor is required"],
    },
    financeSecretary: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: [true, "Finance Secretary is required"],
    },
    members: [{ type: Schema.Types.ObjectId, ref: "Membership" }],
  },
  {
    _id: false,
  }
);

const councilSchema = new Schema<ICouncil>(
  {
    startYear: { type: Date, required: true },
    endYear: { type: Date, required: true },
    localChurch: {
      type: Schema.Types.ObjectId,
      ref: "Local",
      required: [true, "Local Church is required"],
      index: true,
    },
    administrativeOffice: {
      type: administrativeOfficeSchema,
      required: [true, "Administrative Office is required"],
    },
    nurture: {
      type: nurtureSchema,
      required: [true, "Nurture is required"],
    },
    outreach: {
      type: outreachSchema,
      required: [true, "Outreach is required"],
    },
    witness: {
      type: witnessSchema,
      required: [true, "Witness is required"],
    },
    churchHistorian: {
      type: churchHistorianSchema,
      required: [true, "Church Historian is required"],
    },
    communications: {
      type: communicationsSchema,
      required: [true, "Communications is required"],
    },
    finance: {
      type: financeSchema,
      required: [true, "Finance is required"],
    },
    customId: { type: String, unique: true },
  },
  { timestamps: true }
);

// [EXPORT]
const Council = model<ICouncil>("Council", councilSchema);
export default Council;
