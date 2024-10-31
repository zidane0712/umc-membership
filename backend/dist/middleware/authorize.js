"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../models/Users"));
// [FUNCTION]
const authorize = (allowedRoles) => async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access token is required" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await Users_1.default.findById(decoded.userId);
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalide or expired token" });
    }
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map