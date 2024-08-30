// [IMPORTS]
// Mongoose imports
import mongoose, { Document, Schema } from "mongoose";

// [INTERFACE]
export interface IAdministrativeOffice {
  chairperson: mongoose.Types.ObjectId;
  layLeader: mongoose.Types.ObjectId;
  layDelegate: mongoose.Types.ObjectId;
  recordingSecretary: mongoose.Types.ObjectId;
  membershipSecretary: mongoose.Types.ObjectId;
  assistantSecretary: mongoose.Types.ObjectId;
  spprcChairperson: mongoose.Types.ObjectId;
  botChairperson: mongoose.Types.ObjectId;
  viceChairperson: mongoose.Types.ObjectId;
  umyfPresident: mongoose.Types.ObjectId;
  umyafPresident: mongoose.Types.ObjectId;
  umwPresident: mongoose.Types.ObjectId;
  ummPresident: mongoose.Types.ObjectId;
}

export interface INurture {
  chairperson: mongoose.Types.ObjectId;
  worship: mongoose.Types.ObjectId;
  assistant: mongoose.Types.ObjectId;
  sundaySchool: mongoose.Types.ObjectId;
  christianEducation: mongoose.Types.ObjectId;
  stewardship: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}

export interface IOutreach {
  chairperson: mongoose.Types.ObjectId;
  viceChairperson: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}

export interface IWitness {
  chairperson: mongoose.Types.ObjectId;
  viceChairperson: mongoose.Types.ObjectId;
  membershipCare: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}

export interface IChurchHistorian {
  chairperson: mongoose.Types.ObjectId;
  assistant: mongoose.Types.ObjectId;
}

export interface ICommunication {
  chairperson: mongoose.Types.ObjectId;
  assistant: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}

export interface IFinance {
  financeChairperson: mongoose.Types.ObjectId;
  treasurer: mongoose.Types.ObjectId;
  auditor: mongoose.Types.ObjectId;
  financeSecretary: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}

export interface ICouncil extends Document {
  startYear: Date;
  endYear: Date;
  localChurch: mongoose.Types.ObjectId;
  administrativeOffice: IAdministrativeOffice;
  nurture: INurture;
  outreach: IOutreach;
  witness: IWitness;
  churchHistorian: IChurchHistorian;
  communications: ICommunication;
  finance: IFinance;
}

// [SCHEMA]
const administrativeOfficeSchema = new Schema<IAdministrativeOffice>(
  {
    chairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    layLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    layDelegate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    recordingSecretary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    membershipSecretary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    assistantSecretary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    spprcChairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    botChairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    viceChairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    umyfPresident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    umyafPresident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    umwPresident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    ummPresident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
  },
  {
    _id: false,
  }
);

const nurtureSchema = new Schema<INurture>(
  {
    chairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    worship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    assistant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    sundaySchool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    christianEducation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    stewardship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],
  },
  {
    _id: false,
  }
);

const outreachSchema = new Schema<IOutreach>(
  {
    chairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    viceChairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],
  },
  {
    _id: false,
  }
);

const witnessSchema = new Schema<IWitness>(
  {
    chairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    viceChairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    membershipCare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],
  },
  {
    _id: false,
  }
);

const churchHistorianSchema = new Schema<IChurchHistorian>(
  {
    chairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    assistant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
  },
  {
    _id: false,
  }
);

const communicationsSchema = new Schema<ICommunication>(
  {
    chairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    assistant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],
  },
  {
    _id: false,
  }
);

const financeSchema = new Schema<IFinance>(
  {
    financeChairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    treasurer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    auditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    financeSecretary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],
  },
  {
    _id: false,
  }
);

const councilSchema = new Schema<ICouncil>({
  startYear: { type: Date, required: true },
  endYear: { type: Date, required: true },
  localChurch: {
    type: Schema.Types.ObjectId,
    ref: "Local",
    required: true,
    index: true,
  },
  administrativeOffice: {
    type: administrativeOfficeSchema,
    required: true,
  },
  nurture: {
    type: nurtureSchema,
    required: true,
  },
  outreach: {
    type: outreachSchema,
    required: true,
  },
  witness: {
    type: witnessSchema,
    required: true,
  },
  churchHistorian: {
    type: churchHistorianSchema,
    required: true,
  },
  communications: {
    type: communicationsSchema,
    required: true,
  },
  finance: {
    type: financeSchema,
    required: true,
  },
});

// [EXPORT]
const Council = mongoose.model<ICouncil>("Council", councilSchema);
export default Council;
