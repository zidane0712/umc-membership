// [IMPORT]
// Global import
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Local import
import { handleError } from "../utils/handleError";
import User from "../models/Users";
import Counter from "../models/Counter";

// [CONTROLLERS]
// Login
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid username" });

    // Debug logs for password comparison
    console.log("Entered Password:", password); // Plain text password entered by user
    console.log("Stored Hashed Password:", user.password); // Hashed password from database

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // Debug result of password comparison

    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Gets all users
export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all users");
  }
};

// Create new users
export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, role, localChurch, district, annual } =
    req.body;

  try {
    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Password validation: at least 8 characters, one uppercase, one lowercase, one digit, and one special character
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.",
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
        message:
          "Annual Conference is required for users with the 'annual' role.",
      });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Get the next sequence number from a counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate custom ID
    const customId = `USER-${counter?.seq.toString().padStart(4, "0")}`;

    // Create new user
    const newUser = new User({
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
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get user by id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    handleError(res, err, "An error occurred while getting user");
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, localChurch, district, annual } =
      req.body;

    // Check if there's another user with the same username and email address
    const existingUser = await User.findOne({
      username,
      email,
      _id: { $ne: id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this username and email already exists",
      });
    }

    // Find the user by ID to update
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided ID.",
      });
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
        message:
          "Annual Conference is required for users with the 'annual' role.",
      });
    }

    // Update user fields based on the request body
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;

    // Conditional assignment based on user role
    if (role === "local") {
      user.localChurch = localChurch;
      user.district = undefined;
      user.annual = undefined;
    } else if (role === "district") {
      user.district = district;
      user.localChurch = undefined;
      user.annual = undefined;
    } else if (role === "annual") {
      user.annual = annual;
      user.localChurch = undefined;
      user.district = undefined;
    } else {
      user.localChurch = undefined;
      user.district = undefined;
      user.annual = undefined;
    }

    if (password) {
      user.password = password;
    }

    // Save the updated user document
    await user.save();

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await User.findById(id);

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

    // Proceed to delete the user if they are not an admin
    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting the user");
  }
};
