// [IMPORT]
// Global import
import { Request, Response } from "express";
// Local import
import { handleError } from "../utils/handleError";
import Counter from "../models/Counter";
import User from "../models/Users";

// [CONTROLLERS]
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
