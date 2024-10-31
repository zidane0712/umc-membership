"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMinistrySchema = exports.createMinistrySchema = void 0;
// [IMPORT]
const joi_1 = __importDefault(require("joi"));
// [JOI SCHEMA]
// For creating a ministry
exports.createMinistrySchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({
        "string.base": "Name must be a string",
        "any.required": "Name is required",
    }),
    localChurch: joi_1.default.string().required().messages({
        "string.base": "Local church must be a string",
        "any.required": "Local church is required",
    }),
});
// For updating a minsitry
exports.updateMinistrySchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    localChurch: joi_1.default.string().optional(),
});
//# sourceMappingURL=ministryValidator.js.map