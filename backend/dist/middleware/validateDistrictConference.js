"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDistrictConference = void 0;
const District_1 = __importDefault(require("../models/District"));
// [FUNCTION]
const validateDistrictConference = async (req, res, next) => {
    if (req.body.district) {
        const districtConference = await District_1.default.findById(req.body.district);
        if (!districtConference) {
            return res
                .status(400)
                .json({ message: "Invalid District Conference reference." });
        }
    }
    next();
};
exports.validateDistrictConference = validateDistrictConference;
//# sourceMappingURL=validateDistrictConference.js.map