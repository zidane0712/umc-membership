"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocalChurchSchema = exports.createLocalChurchSchema = void 0;
// [IMPORT]
const joi_1 = __importDefault(require("joi"));
// [JOI SCHEMA]
const addressSchema = joi_1.default.object({
    number: joi_1.default.string().optional(),
    street: joi_1.default.string().optional(),
    subdivision: joi_1.default.string().optional(),
    barangay: joi_1.default.string().required().messages({
        "string.base": "Barangay must be a string",
        "any.required": "Barangay is required",
    }),
    municipality: joi_1.default.string().required().messages({
        "string.base": "Municipality/ City must be a string",
        "any.required": "Municipality/ City is required",
    }),
    province: joi_1.default.string().required().messages({
        "string.base": "Province/ City must be a string",
        "any.required": "Province/ City is required",
    }),
    postalCode: joi_1.default.number().required().messages({
        "string.base": "Postal code must be a number",
        "any.required": "Postal code is required",
    }),
});
// For creating local church
exports.createLocalChurchSchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({
        "string.base": "Name must be a string",
        "any.required": "Name is required",
    }),
    address: addressSchema.required(),
    district: joi_1.default.string().required().messages({
        "string.base": "District conference must be a string",
        "any.required": "District conference is required",
    }),
    contactNo: joi_1.default.string()
        .pattern(/^09\d{9}$/)
        .required()
        .messages({
        "string.pattern.base": "Contact number must be a valid cellphone number starting with 09.",
        "any.required": "Contact number is required",
    }),
    anniversaryDate: joi_1.default.date().required().messages({
        "string.base": "Anniversary must be a date",
        "any.required": "Anniversary is required.",
    }),
});
// For updating local church
exports.updateLocalChurchSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    address: addressSchema.optional(),
    district: joi_1.default.string().optional(),
    contactNo: joi_1.default.string().optional(),
    anniversaryDate: joi_1.default.date().optional(),
});
//# sourceMappingURL=localChurchValidator.js.map