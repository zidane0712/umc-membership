"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendanceSchema = exports.createAttendanceSchema = void 0;
// [IMPORT]
// Global import
const joi_1 = __importDefault(require("joi"));
// [JOI SCHEMA]
// Attendance schema fro creating attendance
exports.createAttendanceSchema = joi_1.default.object({
    date: joi_1.default.date().required().messages({
        "any.required": "Date is required",
    }),
    activityName: joi_1.default.string().trim().required().messages({
        "any.required": "Activity name is required",
        "string.empty": "Activity name cannot be empty",
    }),
    description: joi_1.default.string().trim().required().messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be empty",
    }),
    totalAttendees: joi_1.default.number().integer().min(0).required().messages({
        "any.required": "Total number of attendees is required",
        "number.base": "Total attendees must be a number",
        "number.integer": "Total attendees must be an integer",
        "number.min": "Total attendees cannot be negative",
    }),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional().messages({
        "array.includesRequiredUnknowns": "At least one tag is required",
    }),
    localChurch: joi_1.default.string().required().messages({
        "string.base": "Local Church must be a string",
        "any.required": "Local Church is required",
    }),
});
// Attendance schema for updating attendance
exports.updateAttendanceSchema = joi_1.default.object({
    date: joi_1.default.date().optional().messages({
        "date.base": "Date must be a valid date",
    }),
    activityName: joi_1.default.string().trim().optional().messages({
        "string.empty": "Activity name cannot be empty",
    }),
    description: joi_1.default.string().trim().optional().messages({
        "string.empty": "Description cannot be empty",
    }),
    totalAttendees: joi_1.default.number().integer().min(0).optional().messages({
        "number.base": "Total attendees must be a number",
        "number.integer": "Total attendees must be an integer",
        "number.min": "Total attendees cannot be negative",
    }),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional().messages({
        "array.includesRequiredUnknowns": "At least one tag is required",
    }),
    localChurch: joi_1.default.optional().messages({
        "string.base": "Local church's id must be a valid ObjectId",
    }),
});
//# sourceMappingURL=attendanceValidator.js.map