// [IMPORT]
import Joi from "joi";

// [JOI SCHEMA]
export const administrativeOfficeSchema = Joi.object({
  chairperson: Joi.string().required().messages({
    "string.base": "Chairperson must be a string",
    "any.required": "Chairperson is required",
  }),
  layLeader: Joi.string().required().messages({
    "string.base": "Lay leader must be a string",
    "any.required": "Layleader is required",
  }),
  layDelegate: Joi.string().required().messages({
    "string.base": "Lay delegate must be a string",
    "any.required": "Lay delegate is required",
  }),
  recordingSecretary: Joi.string().required().messages({
    "string.base": "Recording Secretary must be a string",
    "any.required": "Recording Secretary is required",
  }),
  membershipSecretary: Joi.string().required().messages({
    "string.base": "Membership Secretary must be a string",
    "any.required": "Membership Secretary is required",
  }),
  assistantSecretary: Joi.string().required().messages({
    "string.base": "Assistant Secretary must be a string",
    "any.required": "Assistant Secretary is required",
  }),
  spprcChairperson: Joi.string().required().messages({
    "string.base": "SPPRC Chairperson must be a string",
    "any.required": "SPPRC Chairperson is required",
  }),
  botChairperson: Joi.string().required().messages({
    "string.base": "BOT Chairperson must be a string",
    "any.required": "BOT Chairperson is required",
  }),
  viceChairperson: Joi.string().required().messages({
    "string.base": "Vice Chairperson must be a string",
    "any.required": "Vice Chairperson is required",
  }),
  umyfPresident: Joi.string().required().messages({
    "string.base": "UMYF President must be a string",
    "any.required": "UMYF President is required",
  }),
  umyafPresident: Joi.string().required().messages({
    "string.base": "UMYAF President must be a string",
    "any.required": "UMYAF President is required",
  }),
  umwPresident: Joi.string().required().messages({
    "string.base": "UMW President must be a string",
    "any.required": "UMW President is required",
  }),
  ummPresident: Joi.string().required().messages({
    "string.base": "UMM President must be a string",
    "any.required": "UMM President is required",
  }),
});

export const nurtureSchema = Joi.object({
  chairperson: Joi.string().required().messages({
    "string.base": "Nurture Chairperson must be a string",
    "any.required": "Nurture Chairperson is required",
  }),
  worship: Joi.string().required().messages({
    "string.base": "Worship must be a string",
    "any.required": "Worship is required",
  }),
  assistant: Joi.string().required().messages({
    "string.base": "Worship Assistant must be a string",
    "any.required": "Worship Assistant is required",
  }),
  sundaySchool: Joi.string().required().messages({
    "string.base": "Sunday school superintendent must be a string",
    "any.required": "Sunday school superintendent is required",
  }),
  christianEducation: Joi.string().required().messages({
    "string.base": "Christian education must be a string",
    "any.required": "Christian education is required",
  }),
  stewardship: Joi.string().required().messages({
    "string.base": "Stewardship must be a string",
    "any.required": "Stewardship is required",
  }),
  members: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.base": "Member ID must be a string",
        "any.required": "Each member ID is required",
      })
    )
    .required()
    .messages({
      "array.base": "Nurture Members must be an array",
      "any.required": "Nurture Members are required",
    }),
});

export const outreachSchema = Joi.object({
  chairperson: Joi.string().required().messages({
    "string.base": "Outreach Chairperson must be a string",
    "any.required": "Outreach Chairperson is required",
  }),
  viceChairperson: Joi.string().required().messages({
    "string.base": "Outreach Vice chairperson must be a string",
    "any.required": "Outreach Vice chairperson is required",
  }),
  members: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.base": "Member ID must be a string",
        "any.required": "Each member ID is required",
      })
    )
    .required()
    .messages({
      "array.base": "Outreach Members must be an array",
      "any.required": "Outreach Members are required",
    }),
});

export const witnessSchema = Joi.object({
  chairperson: Joi.string().required().messages({
    "string.base": "Witness Chairperson must be a string",
    "any.required": "Witness Chairperson is required",
  }),
  viceChairperson: Joi.string().required().messages({
    "string.base": "Witness Vice chairperson must be a string",
    "any.required": "Witness Vice chairperson is required",
  }),
  membershipCare: Joi.string().required().messages({
    "string.base": "Membership Care must be a string",
    "any.required": "Membership Care is required",
  }),
  members: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.base": "Member ID must be a string",
        "any.required": "Each member ID is required",
      })
    )
    .required()
    .messages({
      "array.base": "Witness Members must be an array",
      "any.required": "Witness Members are required",
    }),
});

export const churchHistorianSchema = Joi.object({
  chairperson: Joi.string().required().messages({
    "string.base": "Church Historian Chairperson must be a string",
    "any.required": "Church Historian Chairperson is required",
  }),
  assistant: Joi.string().required().messages({
    "string.base": "Church Historian assistant must be a string",
    "any.required": "Church Historian assistant is required",
  }),
});

export const communicationsSchema = Joi.object({
  chairperson: Joi.string().required().messages({
    "string.base": "Communication Chairperson must be a string",
    "any.required": "Communication Chairperson is required",
  }),
  assistant: Joi.string().required().messages({
    "string.base": "Communications Assistant must be a string",
    "any.required": "Communications Assistant is required",
  }),
  members: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.base": "Member ID must be a string",
        "any.required": "Each member ID is required",
      })
    )
    .required()
    .messages({
      "array.base": "Communication Members must be an array",
      "any.required": "Communication Members are required",
    }),
});

export const financeSchema = Joi.object({
  financeChairperson: Joi.string().required().messages({
    "string.base": "Finance Chairperson must be a string",
    "any.required": "Finance Chairperson is required",
  }),
  treasurer: Joi.string().required().messages({
    "string.base": "Treasurer must be a string",
    "any.required": "Treasurer is required",
  }),
  auditor: Joi.string().required().messages({
    "string.base": "Auditor must be a string",
    "any.required": "Auditor is required",
  }),
  financeSecretary: Joi.string().required().messages({
    "string.base": "Finance Secretary must be a string",
    "any.required": "Finance Secretary is required",
  }),
  members: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.base": "Member ID must be a string",
        "any.required": "Each member ID is required",
      })
    )
    .required()
    .messages({
      "array.base": "Finance Members must be an array",
      "any.required": "Finance Members are required",
    }),
});

export const createCouncilSchema = Joi.object({
  startYear: Joi.date().required(),
  endYear: Joi.date().required(),
  localChurch: Joi.string().required().messages({
    "string.base": "Local Church must be a string",
    "any.required": "Local Church is required",
  }),
  administrativeOffice: administrativeOfficeSchema.required(),
  nurture: nurtureSchema.required(),
  outreach: outreachSchema.required(),
  witness: witnessSchema.required(),
  churchHistorian: churchHistorianSchema.required(),
  communications: communicationsSchema.required(),
  finance: financeSchema.required(),
});

// For updating council
export const updateCouncilSchema = Joi.object({
  startYear: Joi.date().optional(),
  endYear: Joi.date().optional(),
  administrativeOffice: administrativeOfficeSchema.optional(),
  nurture: nurtureSchema.optional(),
  outreach: outreachSchema.optional(),
  witness: witnessSchema.optional(),
  churchHistorian: churchHistorianSchema.optional(),
  communications: communicationsSchema.optional(),
  finance: financeSchema.optional(),
});
