"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDistrictSchema = exports.createDistrictSchema = void 0;
// [IMPORT]
const joi_1 = __importDefault(require("joi"));
// [JOI SCHEMA]
// For creating district conference
exports.createDistrictSchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({
        "string.base": "Name must be a string",
        "any.required": "Name is required",
    }),
    annualConference: joi_1.default.string().required().messages({
        "string.base": "Annual conference must be a string",
        "any.required": "Annual conference is required",
    }),
});
// For updating district conference
exports.updateDistrictSchema = joi_1.default.object({
    name: joi_1.default.string(),
    annualConference: joi_1.default.string(),
});
//# sourceMappingURL=districtValidator.js.map