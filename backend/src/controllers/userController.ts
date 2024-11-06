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

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({
      email,
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Get the next sequence number from a counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate custom Id
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

// Update a user

// Delete user
