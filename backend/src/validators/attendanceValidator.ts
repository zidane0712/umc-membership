// [IMPORT]
// Global import
import Joi from "joi";

// [JOI SCHEMA]
// Attendance schema fro creating attendance
export const createAttendanceSchema = Joi.object({
  date: Joi.date().required().messages({
    "any.required": "Date is required",
  }),
  activityName: Joi.string().trim().required().messages({
    "any.required": "Activity name is required",
    "string.empty": "Activity name cannot be empty",
  }),
  description: Joi.string().trim().required().messages({
    "any.required": "Description is required",
    "string.empty": "Description cannot be empty",
  }),
  totalAttendees: Joi.number().integer().min(0).required().messages({
    "any.required": "Total number of attendees is required",
    "number.base": "Total attendees must be a number",
    "number.integer": "Total attendees must be an integer",
    "number.min": "Total attendees cannot be negative",
  }),
  tags: Joi.array().items(Joi.string().trim()).optional().messages({
    "array.includesRequiredUnknowns": "At least one tag is required",
  }),
  localChurch: Joi.string().required().messages({
    "string.base": "Local Church must be a string",
    "any.required": "Local Church is required",
  }),
});

// Attendance schema for updating attendance
export const updateAttendanceSchema = Joi.object({
  date: Joi.date().optional().messages({
    "date.base": "Date must be a valid date",
  }),
  activityName: Joi.string().trim().optional().messages({
    "string.empty": "Activity name cannot be empty",
  }),
  description: Joi.string().trim().optional().messages({
    "string.empty": "Description cannot be empty",
  }),
  totalAttendees: Joi.number().integer().min(0).optional().messages({
    "number.base": "Total attendees must be a number",
    "number.integer": "Total attendees must be an integer",
    "number.min": "Total attendees cannot be negative",
  }),
  tags: Joi.array().items(Joi.string().trim()).optional().messages({
    "array.includesRequiredUnknowns": "At least one tag is required",
  }),
  localChurch: Joi.optional().messages({
    "string.base": "Local church's id must be a valid ObjectId",
  }),
});
