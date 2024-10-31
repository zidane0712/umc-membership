"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCouncilSchema = exports.createCouncilSchema = exports.financeSchema = exports.communicationsSchema = exports.churchHistorianSchema = exports.witnessSchema = exports.outreachSchema = exports.nurtureSchema = exports.administrativeOfficeSchema = void 0;
// [IMPORT]
const joi_1 = __importDefault(require("joi"));
// [JOI SCHEMA]
exports.administrativeOfficeSchema = joi_1.default.object({
    chairperson: joi_1.default.string().required().messages({
        "string.base": "Chairperson must be a string",
        "any.required": "Chairperson is required",
    }),
    layLeader: joi_1.default.string().required().messages({
        "string.base": "Lay leader must be a string",
        "any.required": "Layleader is required",
    }),
    layDelegate: joi_1.default.string().required().messages({
        "string.base": "Lay delegate must be a string",
        "any.required": "Lay delegate is required",
    }),
    recordingSecretary: joi_1.default.string().required().messages({
        "string.base": "Recording Secretary must be a string",
        "any.required": "Recording Secretary is required",
    }),
    membershipSecretary: joi_1.default.string().required().messages({
        "string.base": "Membership Secretary must be a string",
        "any.required": "Membership Secretary is required",
    }),
    assistantSecretary: joi_1.default.string().required().messages({
        "string.base": "Assistant Secretary must be a string",
        "any.required": "Assistant Secretary is required",
    }),
    spprcChairperson: joi_1.default.string().required().messages({
        "string.base": "SPPRC Chairperson must be a string",
        "any.required": "SPPRC Chairperson is required",
    }),
    botChairperson: joi_1.default.string().required().messages({
        "string.base": "BOT Chairperson must be a string",
        "any.required": "BOT Chairperson is required",
    }),
    viceChairperson: joi_1.default.string().required().messages({
        "string.base": "Vice Chairperson must be a string",
        "any.required": "Vice Chairperson is required",
    }),
    umyfPresident: joi_1.default.string().required().messages({
        "string.base": "UMYF President must be a string",
        "any.required": "UMYF President is required",
    }),
    umyafPresident: joi_1.default.string().required().messages({
        "string.base": "UMYAF President must be a string",
        "any.required": "UMYAF President is required",
    }),
    umwPresident: joi_1.default.string().required().messages({
        "string.base": "UMW President must be a string",
        "any.required": "UMW President is required",
    }),
    ummPresident: joi_1.default.string().required().messages({
        "string.base": "UMM President must be a string",
        "any.required": "UMM President is required",
    }),
});
exports.nurtureSchema = joi_1.default.object({
    chairperson: joi_1.default.string().required().messages({
        "string.base": "Nurture Chairperson must be a string",
        "any.required": "Nurture Chairperson is required",
    }),
    worship: joi_1.default.string().required().messages({
        "string.base": "Worship must be a string",
        "any.required": "Worship is required",
    }),
    assistant: joi_1.default.string().required().messages({
        "string.base": "Worship Assistant must be a string",
        "any.required": "Worship Assistant is required",
    }),
    sundaySchool: joi_1.default.string().required().messages({
        "string.base": "Sunday school superintendent must be a string",
        "any.required": "Sunday school superintendent is required",
    }),
    christianEducation: joi_1.default.string().required().messages({
        "string.base": "Christian education must be a string",
        "any.required": "Christian education is required",
    }),
    stewardship: joi_1.default.string().required().messages({
        "string.base": "Stewardship must be a string",
        "any.required": "Stewardship is required",
    }),
    members: joi_1.default.array()
        .items(joi_1.default.string().required().messages({
        "string.base": "Member ID must be a string",
        "any.required": "Each member ID is required",
    }))
        .required()
        .messages({
        "array.base": "Nurture Members must be an array",
        "any.required": "Nurture Members are required",
    }),
});
exports.outreachSchema = joi_1.default.object({
    chairperson: joi_1.default.string().required().messages({
        "string.base": "Outreach Chairperson must be a string",
        "any.required": "Outreach Chairperson is required",
    }),
    viceChairperson: joi_1.default.string().required().messages({
        "string.base": "Outreach Vice chairperson must be a string",
        "any.required": "Outreach Vice chairperson is required",
    }),
    members: joi_1.default.array()
        .items(joi_1.default.string().required().messages({
        "string.base": "Member ID must be a string",
        "any.required": "Each member ID is required",
    }))
        .required()
        .messages({
        "array.base": "Outreach Members must be an array",
        "any.required": "Outreach Members are required",
    }),
});
exports.witnessSchema = joi_1.default.object({
    chairperson: joi_1.default.string().required().messages({
        "string.base": "Witness Chairperson must be a string",
        "any.required": "Witness Chairperson is required",
    }),
    viceChairperson: joi_1.default.string().required().messages({
        "string.base": "Witness Vice chairperson must be a string",
        "any.required": "Witness Vice chairperson is required",
    }),
    membershipCare: joi_1.default.string().required().messages({
        "string.base": "Membership Care must be a string",
        "any.required": "Membership Care is required",
    }),
    members: joi_1.default.array()
        .items(joi_1.default.string().required().messages({
        "string.base": "Member ID must be a string",
        "any.required": "Each member ID is required",
    }))
        .required()
        .messages({
        "array.base": "Witness Members must be an array",
        "any.required": "Witness Members are required",
    }),
});
exports.churchHistorianSchema = joi_1.default.object({
    chairperson: joi_1.default.string().required().messages({
        "string.base": "Church Historian Chairperson must be a string",
        "any.required": "Church Historian Chairperson is required",
    }),
    assistant: joi_1.default.string().required().messages({
        "string.base": "Church Historian assistant must be a string",
        "any.required": "Church Historian assistant is required",
    }),
});
exports.communicationsSchema = joi_1.default.object({
    chairperson: joi_1.default.string().required().messages({
        "string.base": "Communication Chairperson must be a string",
        "any.required": "Communication Chairperson is required",
    }),
    assistant: joi_1.default.string().required().messages({
        "string.base": "Communications Assistant must be a string",
        "any.required": "Communications Assistant is required",
    }),
    members: joi_1.default.array()
        .items(joi_1.default.string().required().messages({
        "string.base": "Member ID must be a string",
        "any.required": "Each member ID is required",
    }))
        .required()
        .messages({
        "array.base": "Communication Members must be an array",
        "any.required": "Communication Members are required",
    }),
});
exports.financeSchema = joi_1.default.object({
    financeChairperson: joi_1.default.string().required().messages({
        "string.base": "Finance Chairperson must be a string",
        "any.required": "Finance Chairperson is required",
    }),
    treasurer: joi_1.default.string().required().messages({
        "string.base": "Treasurer must be a string",
        "any.required": "Treasurer is required",
    }),
    auditor: joi_1.default.string().required().messages({
        "string.base": "Auditor must be a string",
        "any.required": "Auditor is required",
    }),
    financeSecretary: joi_1.default.string().required().messages({
        "string.base": "Finance Secretary must be a string",
        "any.required": "Finance Secretary is required",
    }),
    members: joi_1.default.array()
        .items(joi_1.default.string().required().messages({
        "string.base": "Member ID must be a string",
        "any.required": "Each member ID is required",
    }))
        .required()
        .messages({
        "array.base": "Finance Members must be an array",
        "any.required": "Finance Members are required",
    }),
});
exports.createCouncilSchema = joi_1.default.object({
    startYear: joi_1.default.date().required(),
    endYear: joi_1.default.date().required(),
    localChurch: joi_1.default.string().required().messages({
        "string.base": "Local Church must be a string",
        "any.required": "Local Church is required",
    }),
    administrativeOffice: exports.administrativeOfficeSchema.required(),
    nurture: exports.nurtureSchema.required(),
    outreach: exports.outreachSchema.required(),
    witness: exports.witnessSchema.required(),
    churchHistorian: exports.churchHistorianSchema.required(),
    communications: exports.communicationsSchema.required(),
    finance: exports.financeSchema.required(),
});
// For updating council
exports.updateCouncilSchema = joi_1.default.object({
    startYear: joi_1.default.date().optional(),
    endYear: joi_1.default.date().optional(),
    localChurch: joi_1.default.string().required().messages({
        "string.base": "Local Church must be a string",
        "any.required": "Local Church is required",
    }),
    administrativeOffice: exports.administrativeOfficeSchema.optional(),
    nurture: exports.nurtureSchema.optional(),
    outreach: exports.outreachSchema.optional(),
    witness: exports.witnessSchema.optional(),
    churchHistorian: exports.churchHistorianSchema.optional(),
    communications: exports.communicationsSchema.optional(),
    finance: exports.financeSchema.optional(),
});
//# sourceMappingURL=councilValidator.js.map