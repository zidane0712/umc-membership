// [IMPORT]
import Joi from "joi";

// [JOI SCHEMA]
// For creating district conference
export const createDistrictSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
  }),
  annualConference: Joi.string().required().messages({
    "string.base": "Annual conference must be a string",
    "any.required": "Annual conference is required",
  }),
});

// For updating district conference
export const updateDistrictSchema = Joi.object({
  name: Joi.string(),
  annualConference: Joi.string(),
});
