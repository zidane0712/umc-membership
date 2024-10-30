// [IMPORT]
// Global import
import Joi from "joi";

// [JOI SCHEMA]
// Schema for creating history
export const createHistorySchema = Joi.object({
  date: Joi.date().required().messages({
    "any.required": "Date is required",
  }),
  historian: Joi.string().trim().required().messages({
    "any.required": "Historian is required",
    "string.empty": "Historian cannot be empty",
  }),
  title: Joi.string().trim().required().messages({
    "any.required": "History title is required",
    "string.empty": "History title cannot be empty",
  }),
  content: Joi.string().trim().required().messages({
    "any.required": "History content is required",
    "string.empty": "History content cannot be empty",
  }),
  tags: Joi.array().items(Joi.string().trim()).optional().messages({
    "array.includesRequiredUnknowns": "Each tag must be a string",
  }),
  mediaLink: Joi.array().items(Joi.string().uri()).optional().messages({
    "array.includesRequiredUnknowns": "Each media link must be a valid URI",
  }),
  localChurch: Joi.string().required().messages({
    "string.base": "Local Church must be a string",
    "any.required": "Local Church is required",
  }),
  customId: Joi.string().optional().messages({
    "string.base": "Custom ID must be a string",
  }),
});

// Schema for updating history
export const updateHistorySchema = Joi.object({
  date: Joi.date().optional().messages({
    "date.base": "Date must be a valid date",
  }),
  historian: Joi.string().trim().optional().messages({
    "string.empty": "Historian cannot be empty",
  }),
  title: Joi.string().trim().optional().messages({
    "string.empty": "History title cannot be empty",
  }),
  content: Joi.string().trim().optional().messages({
    "string.empty": "History content cannot be empty",
  }),
  tags: Joi.array().items(Joi.string().trim()).optional().messages({
    "array.includesRequiredUnknowns": "Each tag must be a string",
  }),
  mediaLink: Joi.array().items(Joi.string().uri()).optional().messages({
    "array.includesRequiredUnknowns": "Each media link must be a valid URI",
  }),
  localChurch: Joi.optional().messages({
    "string.base": "Local church's id must be a valid ObjectId",
  }),
  customId: Joi.string().optional().messages({
    "string.base": "Custom ID must be a string",
  }),
});
