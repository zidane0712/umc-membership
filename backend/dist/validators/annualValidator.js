"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnnualSchema = exports.createAnnualSchema = void 0;
// [IMPORT]
const joi_1 = __importDefault(require("joi"));
// [JOI SCHEMA]
// For creating annual conference
exports.createAnnualSchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({
        "string.base": "Name must be a string",
        "any.required": "Name is required",
    }),
    episcopalArea: joi_1.default.string().valid("bea", "dea", "mea").required().messages({
        "string.base": "Episcopal Area must be a string",
        "any.only": "Episcopal Area must be one of 'BEA', 'DEA', or 'MEA'",
        "any.required": "Episcopal Area is required.",
    }),
});
// For updating annual conference
exports.updateAnnualSchema = joi_1.default.object({
    name: joi_1.default.string(),
    episcopalArea: joi_1.default.string().valid("bea", "dea", "mea").optional(),
});
//# sourceMappingURL=annualValidator.js.map