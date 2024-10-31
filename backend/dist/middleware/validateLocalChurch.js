"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLocalChurch = void 0;
const Local_1 = __importDefault(require("../models/Local"));
// [FUNCTION]
const validateLocalChurch = async (req, res, next) => {
    if (req.body.localChurch) {
        const localChurch = await Local_1.default.findById(req.body.localChurch);
        if (!localChurch) {
            return res
                .status(400)
                .json({ message: "Invalid local Church reference." });
        }
    }
    next();
};
exports.validateLocalChurch = validateLocalChurch;
//# sourceMappingURL=validateLocalChurch.js.map