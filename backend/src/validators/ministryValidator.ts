// [DEPENDENCIES]
import Joi from "joi";

// [JOI SCHEMA]
// For creating a ministry
export const createMinistrySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
  }),
  localChurch: Joi.string().required().messages({
    "string.base": "Local church must be a string",
    "any.required": "Local church is required",
  }),
});

// For updating a minsitry
export const updateMinistrySchema = Joi.object({
  name: Joi.string().optional(),
  localChurch: Joi.string().optional(),
});
