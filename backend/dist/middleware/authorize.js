"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../models/Users"));
// [FUNCTION]
const authorize = (allowedRoles, validateEntityId = false) => async (req, res, next) => {
    var _a, _b, _c, _d;
    try {
        // Extract token from the Authorization header
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            console.log("No token found");
            return res.status(401).json({ message: "Access token is required" });
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find the user based on the token's payload
        const user = await Users_1.default.findById(decoded.id);
        if (!user) {
            console.log("User not found");
            return res.status(403).json({ message: "Access denied" });
        }
        // Check if the user's role is allowed
        if (!allowedRoles.includes(user.role)) {
            console.log("User role not allowed:", user.role);
            return res.status(403).json({ message: "Access denied" });
        }
        // Optional entity ID validation
        if (validateEntityId && req.params.id) {
            let entityId;
            // Determine the entity ID based on the user's role
            if (user.role === "local")
                entityId = (_b = user.localChurch) === null || _b === void 0 ? void 0 : _b.toString();
            if (user.role === "district")
                entityId = (_c = user.district) === null || _c === void 0 ? void 0 : _c.toString();
            if (user.role === "annual")
                entityId = (_d = user.annual) === null || _d === void 0 ? void 0 : _d.toString();
            // Deny access if the entity ID does not match
            if (entityId && entityId !== req.params.id) {
                console.log("Entity ID mismatch: expected", entityId, "but got", req.params.id);
                return res
                    .status(403)
                    .json({ message: "Access denied: Entity ID mismatch" });
            }
        }
        // Attach the user to the request object
        req.user = user;
        // Proceed to the next middleware or route handler
        next();
    }
    catch (err) {
        console.error("Token error:", err);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map