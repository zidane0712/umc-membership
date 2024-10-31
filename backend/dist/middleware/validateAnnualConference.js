"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAnnualConference = void 0;
const Annual_1 = __importDefault(require("../models/Annual"));
// [FUNCTION]
const validateAnnualConference = async (req, res, next) => {
    if (req.body.annualConference) {
        const annualConference = await Annual_1.default.findById(req.body.annualConference);
        if (!annualConference) {
            return res
                .status(400)
                .json({ message: "Invalid Annual Conference reference." });
        }
    }
    next();
};
exports.validateAnnualConference = validateAnnualConference;
//# sourceMappingURL=validateAnnualConference.js.map