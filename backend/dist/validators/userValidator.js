"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
// [IMPORTS]
const joi_1 = __importDefault(require("joi"));
// [JOI SCHEMA]
// Schema for creating a new user
exports.createUserSchema = joi_1.default.object({
    username: joi_1.default.string().trim().required().messages({
        "any.required": "Username is required",
        "string.empty": "Username cannot be empty",
    }),
    email: joi_1.default.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.email": "Email must be a valid email address",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
        "string.min": "Password should be at least 6 characters long",
    }),
    role: joi_1.default.string()
        .valid("admin", "local", "district", "annual", "national")
        .required()
        .messages({
        "any.required": "Role is required",
        "any.only": "Role must be one of admin, local, district, annual, national",
    }),
    localChurch: joi_1.default.string().optional().messages({
        "string.base": "Local Church ID must be a string",
    }),
    district: joi_1.default.string().optional().messages({
        "string.base": "District ID must be a string",
    }),
    annual: joi_1.default.string().optional().messages({
        "string.base": "Annual Conference ID must be a string",
    }),
});
// Schema for updating an existing user
exports.updateUserSchema = joi_1.default.object({
    username: joi_1.default.string().trim().optional().messages({
        "string.empty": "Username cannot be empty",
    }),
    email: joi_1.default.string().email().optional().messages({
        "string.empty": "Email cannot be empty",
        "string.email": "Email must be a valid email address",
    }),
    password: joi_1.default.string().min(6).optional().messages({
        "string.empty": "Password cannot be empty",
        "string.min": "Password should be at least 6 characters long",
    }),
    role: joi_1.default.string()
        .valid("admin", "local", "district", "annual", "national")
        .optional()
        .messages({
        "any.only": "Role must be one of admin, local, district, annual, national",
    }),
    localChurch: joi_1.default.string().optional().messages({
        "string.base": "Local Church ID must be a string",
    }),
    district: joi_1.default.string().optional().messages({
        "string.base": "District ID must be a string",
    }),
    annual: joi_1.default.string().optional().messages({
        "string.base": "Annual Conference ID must be a string",
    }),
});
//# sourceMappingURL=userValidator.js.map