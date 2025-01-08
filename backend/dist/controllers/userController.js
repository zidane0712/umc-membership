"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.createUser = exports.getAllUser = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Local import
const handleError_1 = require("../utils/handleError");
const Users_1 = __importDefault(require("../models/Users"));
const Counter_1 = __importDefault(require("../models/Counter"));
// [CONTROLLERS]
// Login
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Users_1.default.findOne({ username });
        if (!user)
            return res.status(401).json({ message: "Invalid username" });
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        console.log("Password match:", isMatch); // Debug result of password comparison
        if (!isMatch)
            return res.status(401).json({ message: "Invalid password" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.status(200).json({ token });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
exports.loginUser = loginUser;
// Gets all users
const getAllUser = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        // Convert pagination params to numbers
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        // Build the search filter
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        // Fetch users with pagination and filtering
        const users = await Users_1.default.find(filter)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);
        // Get total count for pagination metadata
        const totalCount = await Users_1.default.countDocuments(filter);
        // Calculate metadata
        const meta = {
            total: totalCount,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalCount / limitNum),
        };
        return res.status(200).json({
            success: true,
            data: users,
            meta,
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting all users");
    }
};
exports.getAllUser = getAllUser;
// Create new users
const createUser = async (req, res) => {
    const { username, email, password, role, localChurch, district, annual } = req.body;
    try {
        // Validate required fields
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // Password validation: at least 6 characters, one uppercase, one lowercase, one digit, and one special character
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!passwordPattern.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long and include an uppercase letter, lowercase letter, number, and special character.",
            });
        }
        // Role-based validation for localChurch, district, and annual fields
        if (role === "local" && !localChurch) {
            return res.status(400).json({
                message: "Local Church is required for users with the 'local' role.",
            });
        }
        if (role === "district" && !district) {
            return res.status(400).json({
                message: "District is required for users with the 'district' role.",
            });
        }
        if (role === "annual" && !annual) {
            return res.status(400).json({
                message: "Annual Conference is required for users with the 'annual' role.",
            });
        }
        // Check if the username already exists
        const existingUser = await Users_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        // Check if the email already exists
        const existingEmail = await Users_1.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        // Get the next sequence number from a counter collection
        const counter = await Counter_1.default.findOneAndUpdate({ _id: "userId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        // Generate custom ID
        const customId = `USER-${counter === null || counter === void 0 ? void 0 : counter.seq.toString().padStart(4, "0")}`;
        // Create new user
        const newUser = new Users_1.default({
            username,
            email,
            password,
            role,
            localChurch: role === "local" ? localChurch : undefined,
            district: role === "district" ? district : undefined,
            annual: role === "annual" ? annual : undefined,
            customId,
        });
        // Save the new user
        await newUser.save();
        return res
            .status(201)
            .json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createUser = createUser;
// Get user by id
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Users_1.default.findById(id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while getting user");
    }
};
exports.getUserById = getUserById;
// Update a user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role, localChurch, district, annual } = req.body;
        // Check if there's another user with same username
        if (username) {
            const existingUsername = await Users_1.default.findOne({
                username,
                _id: { $ne: id },
            });
            if (existingUsername) {
                return res.status(409).json({
                    success: false,
                    message: "A user with this username already exists.",
                });
            }
        }
        // Check if there's another user with same email
        if (email) {
            const existingEmail = await Users_1.default.findOne({
                email,
                _id: { $ne: id },
            });
            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: "A user with this email already exists.",
                });
            }
        }
        // Find the user by ID to update
        const user = await Users_1.default.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with the provided ID.",
            });
        }
        // Validate password: at least 6 characters, one uppercase, one lowercase, one digit, and one special character
        if (password) {
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
            if (!passwordPattern.test(password)) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters long and include an uppercase letter, lowercase letter, number, and special character.",
                });
            }
            user.password = password;
        }
        // Validate required fields based on the role
        if (role === "local" && !localChurch) {
            return res.status(400).json({
                success: false,
                message: "Local Church is required for users with the 'local' role.",
            });
        }
        if (role === "district" && !district) {
            return res.status(400).json({
                success: false,
                message: "District is required for users with the 'district' role.",
            });
        }
        if (role === "annual" && !annual) {
            return res.status(400).json({
                success: false,
                message: "Annual Conference is required for users with the 'annual' role.",
            });
        }
        // Update user fields based on the request body
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (role)
            user.role = role;
        // Conditional assignment based on user role
        if (role === "local") {
            user.localChurch = localChurch;
            user.district = undefined;
            user.annual = undefined;
        }
        else if (role === "district") {
            user.district = district;
            user.localChurch = undefined;
            user.annual = undefined;
        }
        else if (role === "annual") {
            user.annual = annual;
            user.localChurch = undefined;
            user.district = undefined;
        }
        else {
            user.localChurch = undefined;
            user.district = undefined;
            user.annual = undefined;
        }
        if (password) {
            user.password = password;
        }
        // Update the user document
        const updatedUser = await Users_1.default.findOneAndUpdate({ _id: id }, {
            $set: {
                username,
                email,
                password,
                role,
                localChurch,
                district,
                annual,
            },
        }, { new: true } // Return the updated document
        );
        return res.status(200).json({ message: "User updated successfully", user });
    }
    catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateUser = updateUser;
// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Find user by ID
        const user = await Users_1.default.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Check if the user has the "admin" role
        if (user.role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Cannot delete users with the admin role",
            });
        }
        // Use findOneAndDelete to trigger middleware
        const deletedUser = await Users_1.default.findOneAndDelete({ _id: id });
        if (!deletedUser) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete user",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (err) {
        (0, handleError_1.handleError)(res, err, "An error occurred while deleting the user");
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map