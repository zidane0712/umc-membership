"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMembershipSchema = exports.createMembershipSchema = void 0;
// [IMPORT]
const joi_1 = __importDefault(require("joi"));
// [JOI SCHEMA]
// Address validation
const addressSchema = joi_1.default.object({
    number: joi_1.default.string().optional(),
    street: joi_1.default.string().optional(),
    subdivision: joi_1.default.string().optional(),
    barangay: joi_1.default.string().required().messages({
        "string.base": "Barangay must be a string",
        "any.required": "Barangay is required",
    }),
    municipality: joi_1.default.string().required().messages({
        "string.base": "Municipality/ City must be a string",
        "any.required": "Municipality/ City is required",
    }),
    province: joi_1.default.string().required().messages({
        "string.base": "Province/ City must be a string",
        "any.required": "Province/ City is required",
    }),
    postalCode: joi_1.default.number().required().messages({
        "string.base": "Postal code must be a number",
        "any.required": "Postal code is required",
    }),
});
// Baptism/Confirmation validation
const baptismConfirmationSchema = joi_1.default.object({
    year: joi_1.default.number().optional(),
    minister: joi_1.default.string().optional(),
});
// Family validation
const familySchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    isMember: joi_1.default.boolean().default(false),
});
// For adding membership
exports.createMembershipSchema = joi_1.default.object({
    name: joi_1.default.object({
        firstname: joi_1.default.string().required().messages({
            "string.base": "First name must be a string",
            "any.required": "First name is required",
        }),
        middlename: joi_1.default.string().optional(),
        lastname: joi_1.default.string().required().messages({
            "string.base": "Last name must be a string",
            "any.required": "Last name is required",
        }),
        suffix: joi_1.default.string().optional(),
    }).required(),
    address: joi_1.default.object({
        permanent: addressSchema.required(),
        current: addressSchema.required(),
    }).required(),
    gender: joi_1.default.string().valid("male", "female").required().messages({
        "string.base": "Gender must be a string",
        "any.required": "Gender is required",
    }),
    civilStatus: joi_1.default.string()
        .valid("single", "married", "separated", "widowed")
        .required()
        .messages({
        "string.base": "Civil status must be a string",
        "any.required": "Civil status is required",
    }),
    birthday: joi_1.default.date().required().messages({
        "string.base": "Birthday must be a date",
        "any.required": "Birthday is required",
    }),
    contactNo: joi_1.default.string()
        .pattern(/^09\d{9}$/)
        .required()
        .messages({
        "string.pattern.base": "Contact number must be a valid cellphone number starting with 09.",
    }),
    isBaptized: joi_1.default.boolean().default(false),
    baptism: baptismConfirmationSchema.optional(),
    isConfirmed: joi_1.default.boolean().default(false),
    confirmation: baptismConfirmationSchema.optional(),
    father: familySchema.optional(),
    mother: familySchema.optional(),
    spouse: familySchema.optional(),
    children: joi_1.default.array().items(familySchema).optional(),
    membershipClassification: joi_1.default.string()
        .valid("baptized", "professing", "affiliate", "associate", "constituent")
        .required()
        .messages({
        "string.base": "Membership classification must be a string",
        "any.required": "Membership classification is required",
    }),
    isActive: joi_1.default.boolean().default(false),
    organization: joi_1.default.string()
        .valid("umm", "umwscs", "umyaf", "umyf", "umcf")
        .optional(),
    ministries: joi_1.default.array().items(joi_1.default.string()).optional(),
    council: joi_1.default.array().items(joi_1.default.string()).optional(),
    localChurch: joi_1.default.string().required().messages({
        "string.base": "Local church must be a string",
        "any.required": "Local church is required",
    }),
});
// For updating a membership
exports.updateMembershipSchema = joi_1.default.object({
    name: joi_1.default.object({
        firstname: joi_1.default.string().optional(),
        middlename: joi_1.default.string().optional(),
        lastname: joi_1.default.string().optional(),
        suffix: joi_1.default.string().optional(),
    }).optional(),
    address: joi_1.default.object({
        permanent: addressSchema.optional(),
        current: addressSchema.optional(),
    }).optional(),
    gender: joi_1.default.string().valid("male", "female").optional(),
    civilStatus: joi_1.default.string()
        .valid("single", "married", "separated", "widowed")
        .optional(),
    birthday: joi_1.default.date().optional(),
    contactNo: joi_1.default.string()
        .pattern(/^09\d{9}$/)
        .optional()
        .messages({
        "string.pattern.base": "Contact number must be a valid cellphone number starting with 09.",
    }),
    baptism: baptismConfirmationSchema.optional(),
    confirmation: baptismConfirmationSchema.optional(),
    father: familySchema.optional(),
    mother: familySchema.optional(),
    spouse: familySchema.optional(),
    children: joi_1.default.array().items(familySchema).optional(),
    membershipClassification: joi_1.default.string()
        .valid("baptized", "professing", "affiliate", "associate", "constituent")
        .optional(),
    isActive: joi_1.default.boolean().optional(),
    isConfirmed: joi_1.default.boolean().optional(),
    isBaptized: joi_1.default.boolean().optional(),
    organization: joi_1.default.string()
        .valid("umm", "umwscs", "umyaf", "umyf", "umcf")
        .optional(),
    ministries: joi_1.default.array().items(joi_1.default.string()).optional(),
    council: joi_1.default.array().items(joi_1.default.string()).optional(),
    localChurch: joi_1.default.string().optional(),
});
//# sourceMappingURL=membershipValidator.js.map