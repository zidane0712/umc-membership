// [IMPORT]
// Global import
import Joi from "joi";

// [JOI SCHEMA]
// Family schema for creating a family
export const createFamilySchema = Joi.object({
  familyName: Joi.string().required().trim().messages({
    "string.base": "Family name must be a string",
    "any.required": "Family name is required",
  }),
  father: Joi.string().optional(),
  mother: Joi.string().optional(),
  weddingDate: Joi.date().optional(),
  children: Joi.array().optional(),
  localChurch: Joi.string().required().messages({
    "string.base": "Local Church must be a string",
    "any.required": "Local Church is required",
  }),
});

// Family schema for updating a family
export const updateFamilySchema = Joi.object({
  familyName: Joi.string().optional().trim().messages({
    "string.base": "Family name must be a string",
  }),
  father: Joi.optional().messages({
    "string.base": "Father's memberId must be a valid ObjectId",
  }),
  mother: Joi.optional().messages({
    "string.base": "Mother's memberId must be a valid ObjectId",
  }),
  weddingDate: Joi.date().optional().messages({
    "date.base": "Wedding date must be a valid date",
  }),
  children: Joi.array().optional().messages({
    "array.base": "Children must be an array",
  }),
  localChurch: Joi.optional().messages({
    "string.base": "Local church's id must be a valid ObjectId",
  }),
});
