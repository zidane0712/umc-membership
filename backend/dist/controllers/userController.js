"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = void 0;
// Local import
const handleError_1 = require("../utils/handleError");
const Users_1 = __importDefault(require("../models/Users"));
// [CONTROLLERS]
// Gets all users
const getAllUser = async (req, res) => {
    try {
        const users = await Users_1.default.find();
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting all users");
    }
};
exports.getAllUser = getAllUser;
// Create new users
// Get user by id
// Update a user
// Delete user
//# sourceMappingURL=userController.js.map