// [DEPENDENCIES]
import Joi from "joi";

// [JOI SCHEMA]
// Address validation
const addressSchema = Joi.object({
  number: Joi.string().required(),
  street: Joi.string().optional(),
  subdivision: Joi.string().optional(),
  barangay: Joi.string().required(),
  municipality: Joi.string().required(),
  province: Joi.string().required(),
  postalCode: Joi.number().required(),
});

// Baptism/Confirmation validation
const baptismConfirmationSchema = Joi.object({
  year: Joi.number().optional(),
  minister: Joi.string().optional(),
}).custom((value, helpers) => {
  if (!value.year && !value.minister) {
    return helpers.message({
      custom: "Either year or minister must be provided.",
    });
  }
  return value;
});

// Family validation
const familySchema = Joi.object({
  name: Joi.string().required(),
  isMember: Joi.boolean().default(false),
});

// For adding membership
export const createMembershipSchema = Joi.object({
  name: Joi.object({
    firstname: Joi.string().required(),
    middlename: Joi.string().optional(),
    lastname: Joi.string().required(),
    suffix: Joi.string().optional(),
  }).required(),
  address: Joi.object({
    permanent: addressSchema.required(),
    current: addressSchema.required(),
  }).required(),
  gender: Joi.string().valid("male", "female").required(),
  civilStatus: Joi.string()
    .valid("single", "married", "separated", "widowed")
    .required(),
  birthday: Joi.date().required(),
  contactNo: Joi.string()
    .pattern(/^09\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Contact number must be a valid cellphone number starting with 09.",
    }),
  baptism: baptismConfirmationSchema.required(),
  confirmation: baptismConfirmationSchema.required(),
  father: familySchema.optional(),
  mother: familySchema.optional(),
  spouse: familySchema.optional(),
  children: Joi.array().items(familySchema).optional(),
  membershipClassification: Joi.string()
    .valid("baptized", "professing", "affiliate", "associate", "constituent")
    .required(),
  isActive: Joi.boolean().default(false),
  organization: Joi.string()
    .valid("umm", "umwscs", "umyaf", "umyf", "umcf")
    .optional(),
  ministries: Joi.array().items(Joi.string()).optional(),
  council: Joi.array().items(Joi.string()).optional(),
  annualConference: Joi.string().required().messages({
    "string.base": "Annual Conference must be a string",
    "any.required": "Annual Conference is required",
  }),
  district: Joi.string().required().messages({
    "string.base": "District Conference must be a string",
    "any.required": "District Conference is required",
  }),
  localChurch: Joi.string().required().messages({
    "string.base": "Local church must be a string",
    "any.required": "Local church is required",
  }),
});

// For updating a membership
export const updateMembershipSchema = Joi.object({
  name: Joi.object({
    firstname: Joi.string().optional(),
    middlename: Joi.string().optional(),
    lastname: Joi.string().optional(),
    suffix: Joi.string().optional(),
  }).optional(),
  address: Joi.object({
    permanent: addressSchema.optional(),
    current: addressSchema.optional(),
  }).optional(),
  gender: Joi.string().valid("male", "female").optional(),
  civilStatus: Joi.string()
    .valid("single", "married", "separated", "widowed")
    .optional(),
  birthday: Joi.date().optional(),
  contactNo: Joi.string()
    .pattern(/^09\d{9}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Contact number must be a valid cellphone number starting with 09.",
    }),
  baptism: baptismConfirmationSchema.optional(),
  confirmation: baptismConfirmationSchema.optional(),
  father: familySchema.optional(),
  mother: familySchema.optional(),
  spouse: familySchema.optional(),
  children: Joi.array().items(familySchema).optional(),
  membershipClassification: Joi.string()
    .valid("baptized", "professing", "affiliate", "associate", "constituent")
    .optional(),
  isActive: Joi.boolean().optional(),
  organization: Joi.string()
    .valid("umm", "umwscs", "umyaf", "umyf", "umcf")
    .optional(),
  ministries: Joi.array().items(Joi.string()).optional(),
  council: Joi.array().items(Joi.string()).optional(),
  annualConference: Joi.string().optional(),
  district: Joi.string().optional(),
  localChurch: Joi.string().optional(),
});
