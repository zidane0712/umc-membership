// [DEPENDENCIES]
import Joi from "joi";

// [JOI SCHEMA]
// For creating annual conference
export const createAnnualSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
  }),
  episcopalArea: Joi.string().valid("bea", "dea", "mea").required().messages({
    "string.base": "Episcopal Area must be a string",
    "any.only": "Episcopal Area must be one of 'BEA', 'DEA', or 'MEA'",
    "any.required": "Episcopal Area is required.",
  }),
});

// For updating annual conference
export const updateAnnualSchema = Joi.object({
  name: Joi.string(),
  episcopalArea: Joi.string().valid("bea", "dea", "mea").optional(),
});
