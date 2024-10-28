// [IMPORT]
// Global import
import { Request, Response } from "express";
// Local import
import { handleError } from "../utils/handleError";
import History from "../models/History";
import Counter from "../models/Counter";

// [CONTROLLERS]
// Get all history
export const getAllHistory = async (req: Request, res: Response) => {
  try {
    const histories = await History.find();

    res.status(200).json({ success: true, data: histories });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all histories");
  }
};
