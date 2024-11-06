// [IMPORT]
// Global import
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Local import
import { handleError } from "../utils/handleError";
import User from "../models/Users";

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

// Get user by id

// Update a user

// Delete user
