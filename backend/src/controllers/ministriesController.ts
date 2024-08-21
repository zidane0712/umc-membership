// [DEPENDENCIES]
import { NextFunction, Request, Response } from "express";

// [IMPORTS]
import Local from "../models/Local";
import Membership from "../models/Membership";
import Ministry from "../models/Ministries";
import { handleError } from "../utils/handleError";

// [CONTROLLERS]

// Gets all ministries
export const getAllMinistry = async (req: Request, res: Response) => {
  try {
    const ministries = await Ministry.find().populate("localChurch");
    res.status(200).json({ success: true, data: ministries });
  } catch (err) {
    handleError(res, err, "An unknown error occured");
  }
};

// Create a new ministry
export const createMinistry = async (req: Request, res: Response) => {
  const ministry = new Ministry(req.body);
  try {
    const newMinistry = await ministry.save();
    res.status(201).json(newMinistry);
  } catch (err) {
    handleError(res, err, "An unknonw error occured");
  }
};

// Get a single ministry by ID
export const getMinistryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ministry = await Ministry.findById(id).populate("localChurch");

    if (!ministry) {
      return res
        .status(404)
        .json({ success: false, message: "Ministry not found" });
    }

    res.status(200).json({ success: true, data: ministry });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// Update a ministry by ID
export const updateMinistry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.local) {
      const localChurch = await Local.findById(updateData.localChurch);
      if (!localChurch) {
        return res
          .status(400)
          .json({ message: "Invalid Local Church reference." });
      }
    }

    const updateMinistry = await Ministry.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updateMinistry) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    res.status(200).json(updateMinistry);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// Delete a ministry
export const deleteMinistry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteMinistry = await Ministry.findByIdAndDelete(id);

    if (!deleteMinistry) {
      return res
        .status(404)
        .json({ success: false, message: "Ministry not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Ministry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
