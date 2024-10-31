"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHistorySchema = exports.createHistorySchema = void 0;
// [IMPORT]
// Global import
const joi_1 = __importDefault(require("joi"));
// [JOI SCHEMA]
// Schema for creating history
exports.createHistorySchema = joi_1.default.object({
    date: joi_1.default.date().required().messages({
        "any.required": "Date is required",
    }),
    historian: joi_1.default.string().trim().required().messages({
        "any.required": "Historian is required",
        "string.empty": "Historian cannot be empty",
    }),
    title: joi_1.default.string().trim().required().messages({
        "any.required": "History title is required",
        "string.empty": "History title cannot be empty",
    }),
    content: joi_1.default.string().trim().required().messages({
        "any.required": "History content is required",
        "string.empty": "History content cannot be empty",
    }),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional().messages({
        "array.includesRequiredUnknowns": "Each tag must be a string",
    }),
    mediaLink: joi_1.default.array().items(joi_1.default.string().uri()).optional().messages({
        "array.includesRequiredUnknowns": "Each media link must be a valid URI",
    }),
    localChurch: joi_1.default.string().required().messages({
        "string.base": "Local Church must be a string",
        "any.required": "Local Church is required",
    }),
    customId: joi_1.default.string().optional().messages({
        "string.base": "Custom ID must be a string",
    }),
});
// Schema for updating history
exports.updateHistorySchema = joi_1.default.object({
    date: joi_1.default.date().optional().messages({
        "date.base": "Date must be a valid date",
    }),
    historian: joi_1.default.string().trim().optional().messages({
        "string.empty": "Historian cannot be empty",
    }),
    title: joi_1.default.string().trim().optional().messages({
        "string.empty": "History title cannot be empty",
    }),
    content: joi_1.default.string().trim().optional().messages({
        "string.empty": "History content cannot be empty",
    }),
    tags: joi_1.default.array().items(joi_1.default.string().trim()).optional().messages({
        "array.includesRequiredUnknowns": "Each tag must be a string",
    }),
    mediaLink: joi_1.default.array().items(joi_1.default.string().uri()).optional().messages({
        "array.includesRequiredUnknowns": "Each media link must be a valid URI",
    }),
    localChurch: joi_1.default.optional().messages({
        "string.base": "Local church's id must be a valid ObjectId",
    }),
    customId: joi_1.default.string().optional().messages({
        "string.base": "Custom ID must be a string",
    }),
});
//# sourceMappingURL=historyValidator.js.map