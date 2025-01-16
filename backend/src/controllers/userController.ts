// [IMPORT]
// Global import
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Local import
import { handleError } from "../utils/handleError";
import User from "../models/Users";
import Counter from "../models/Counter";
import { AuthenticatedRequest } from "../middleware/authorize";
import Log from "../models/Logs";

// [CONTROLLERS]
// Login
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).lean();
    if (!user) return res.status(401).json({ message: "Invalid username" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        customId: user.customId,
        localChurch: user.localChurch,
        district: user.district,
        annual: user.annual,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "3h",
      }
    );

    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// [USER CONTROLLER]
export const getUserDetails = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req.user; // Since you're already attaching the user in the authorize middleware.
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  return res.status(200).json({ success: true, user });
};

// Gets all users
export const getAllUser = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Convert pagination params to numbers
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;

    // Build the search filter
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch users with pagination and filtering
    const users = await User.find(filter)
      .select("-password")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Get total count for pagination metadata
    const totalCount = await User.countDocuments(filter);

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
  } catch (err) {
    handleError(res, err, "An error occurred while getting all users");
  }
};

// Create new users
export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  const { username, email, password, role, localChurch, district, annual } =
    req.body;

  try {
    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Password validation: at least 6 characters, one uppercase, one lowercase, one digit, and one special character
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and include an uppercase letter, lowercase letter, number, and special character.",
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

    // Log the action done
    await Log.create({
      action: "created",
      collection: "User",
      documentId: newUser._id,
      data: newUser.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

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
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, localChurch, district, annual } =
      req.body;

    // Check if there's another user with the same username
    if (username) {
      const existingUsername = await User.findOne({
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

    // Check if there's another user with the same email
    if (email) {
      const existingEmail = await User.findOne({
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

    // Update user fields based on the request body
    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    // Conditional assignment based on user role
    if (role === "local") {
      updateData.localChurch = localChurch;
      updateData.district = undefined;
      updateData.annual = undefined;
    } else if (role === "district") {
      updateData.district = district;
      updateData.localChurch = undefined;
      updateData.annual = undefined;
    } else if (role === "annual") {
      updateData.annual = annual;
      updateData.localChurch = undefined;
      updateData.district = undefined;
    } else {
      updateData.localChurch = undefined;
      updateData.district = undefined;
      updateData.annual = undefined;
    }

    // Validate password if provided
    if (password) {
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
      if (!passwordPattern.test(password)) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 6 characters long and include an uppercase letter, lowercase letter, number, and special character.",
        });
      }
      updateData.password = password;
    }

    // Perform the update
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided ID.",
      });
    }

    // Log the action
    await Log.create({
      action: "updated",
      collection: "User",
      documentId: updatedUser._id,
      data: { prevData: updatedUser.toObject(), newData: updateData },
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete user
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
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

    // Log the action
    await Log.create({
      action: "deleted",
      collection: "User",
      documentId: user._id,
      data: user.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting the user");
  }
};
