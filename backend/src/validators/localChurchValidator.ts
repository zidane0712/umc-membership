// [DEPENDENCIES]
import Joi from "joi";

// [JOI SCHEMA]
const addressSchema = Joi.object({
  number: Joi.string().required(),
  street: Joi.string().optional(),
  subdivision: Joi.string().optional(),
  barangay: Joi.string().required(),
  municipality: Joi.string().required(),
  province: Joi.string().required(),
  postalCode: Joi.number().required(),
});

// For creating local church
export const createLocalChurchSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
  }),
  address: addressSchema.required(),
  district: Joi.string().required().messages({
    "string.base": "Annual conference must be a string",
    "any.required": "Annual conference is required",
  }),
});

// For updating local church
export const updateLocalChurchSchema = Joi.object({
  name: Joi.string(),
  address: addressSchema.optional(),
  district: Joi.string(),
});
