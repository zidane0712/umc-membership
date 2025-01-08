"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialAdmin = void 0;
// Local
const Users_1 = __importDefault(require("../models/Users"));
// [FUNCTION]
const createInitialAdmin = async () => {
    try {
        const existingAdmin = await Users_1.default.findOne({ role: "admin" });
        if (existingAdmin) {
            console.log("Initial admin already exists");
            return;
        }
        const adminDetails = {
            username: process.env.ADMIN_USERNAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: "admin",
        };
        if (!adminDetails.password) {
            throw new Error("ADMIN_PASSWORD is not defined in the .env file.");
        }
        console.log("Plain text password from .env:", adminDetails.password);
        const adminUser = new Users_1.default(adminDetails);
        await adminUser.save();
        console.log("Initial admin user created successfully.");
    }
    catch (err) {
        console.error("An error occurred while creating initial admin:", err);
    }
};
exports.createInitialAdmin = createInitialAdmin;
//# sourceMappingURL=initialUser.js.map