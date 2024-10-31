// [IMPORTS]
import Joi from "joi";

// [JOI SCHEMA]
// Schema for creating a new user
export const createUserSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
    "string.min": "Password should be at least 6 characters long",
  }),
  role: Joi.string()
    .valid("admin", "local", "district", "annual", "national")
    .required()
    .messages({
      "any.required": "Role is required",
      "any.only":
        "Role must be one of admin, local, district, annual, national",
    }),
  localChurch: Joi.string().optional().messages({
    "string.base": "Local Church ID must be a string",
  }),
  district: Joi.string().optional().messages({
    "string.base": "District ID must be a string",
  }),
  annual: Joi.string().optional().messages({
    "string.base": "Annual Conference ID must be a string",
  }),
});

// Schema for updating an existing user
export const updateUserSchema = Joi.object({
  username: Joi.string().trim().optional().messages({
    "string.empty": "Username cannot be empty",
  }),
  email: Joi.string().email().optional().messages({
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.empty": "Password cannot be empty",
    "string.min": "Password should be at least 6 characters long",
  }),
  role: Joi.string()
    .valid("admin", "local", "district", "annual", "national")
    .optional()
    .messages({
      "any.only":
        "Role must be one of admin, local, district, annual, national",
    }),
  localChurch: Joi.string().optional().messages({
    "string.base": "Local Church ID must be a string",
  }),
  district: Joi.string().optional().messages({
    "string.base": "District ID must be a string",
  }),
  annual: Joi.string().optional().messages({
    "string.base": "Annual Conference ID must be a string",
  }),
});
