"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFamilySchema = exports.createFamilySchema = void 0;
// [IMPORT]
// Global import
const joi_1 = __importDefault(require("joi"));
// [JOI SCHEMA]
// Family schema for creating a family
exports.createFamilySchema = joi_1.default.object({
    familyName: joi_1.default.string().required().trim().messages({
        "string.base": "Family name must be a string",
        "any.required": "Family name is required",
    }),
    father: joi_1.default.string().optional(),
    mother: joi_1.default.string().optional(),
    weddingDate: joi_1.default.date().optional(),
    children: joi_1.default.array().optional(),
    localChurch: joi_1.default.string().required().messages({
        "string.base": "Local Church must be a string",
        "any.required": "Local Church is required",
    }),
});
// Family schema for updating a family
exports.updateFamilySchema = joi_1.default.object({
    familyName: joi_1.default.string().optional().trim().messages({
        "string.base": "Family name must be a string",
    }),
    father: joi_1.default.optional().messages({
        "string.base": "Father's memberId must be a valid ObjectId",
    }),
    mother: joi_1.default.optional().messages({
        "string.base": "Mother's memberId must be a valid ObjectId",
    }),
    weddingDate: joi_1.default.date().optional().messages({
        "date.base": "Wedding date must be a valid date",
    }),
    children: joi_1.default.array().optional().messages({
        "array.base": "Children must be an array",
    }),
    localChurch: joi_1.default.optional().messages({
        "string.base": "Local church's id must be a valid ObjectId",
    }),
});
//# sourceMappingURL=familyValidator.js.map