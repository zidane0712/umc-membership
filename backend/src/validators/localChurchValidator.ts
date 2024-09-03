// [IMPORT]
import Joi from "joi";

// [JOI SCHEMA]
const addressSchema = Joi.object({
  number: Joi.string().optional(),
  street: Joi.string().optional(),
  subdivision: Joi.string().optional(),
  barangay: Joi.string().required().messages({
    "string.base": "Barangay must be a string",
    "any.required": "Barangay is required",
  }),
  municipality: Joi.string().required().messages({
    "string.base": "Municipality/ City must be a string",
    "any.required": "Municipality/ City is required",
  }),
  province: Joi.string().required().messages({
    "string.base": "Province/ City must be a string",
    "any.required": "Province/ City is required",
  }),
  postalCode: Joi.number().required().messages({
    "string.base": "Postal code must be a number",
    "any.required": "Postal code is required",
  }),
});

// For creating local church
export const createLocalChurchSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
  }),
  address: addressSchema.required(),
  district: Joi.string().required().messages({
    "string.base": "District conference must be a string",
    "any.required": "District conference is required",
  }),
  annualConference: Joi.string().required().messages({
    "string.base": "Annual conference must be a string",
    "any.required": "Annual conference is required",
  }),
  contactNo: Joi.string()
    .pattern(/^09\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Contact number must be a valid cellphone number starting with 09.",
      "any.required": "Contact number is required",
    }),
  anniversaryDate: Joi.date().required().messages({
    "string.base": "Anniversary must be a date",
    "any.required": "Anniversary is required.",
  }),
});

// For updating local church
export const updateLocalChurchSchema = Joi.object({
  name: Joi.string().optional(),
  address: addressSchema.optional(),
  district: Joi.string().optional(),
  annualConference: Joi.string().optional(),
  contactNo: Joi.string().optional(),
  anniversaryDate: Joi.date().optional(),
});
