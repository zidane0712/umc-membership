"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// [FUNCTION]
const asyncHandler = (func) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map