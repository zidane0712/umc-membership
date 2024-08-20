// [DEPENDENCIES]
import { NextFunction, Request, Response } from "express";

// [IMPORTS]
import Local from "../models/Local";
import District from "../models/District";
import Annual from "../models/Annual";
import { handleError } from "../utils/handleError";

// [CONTROLLERS]
// Get all local church
export const getAllLocalChurch = async (req: Request, res: Response) => {
  try {
    const localChurch = await Local.find().populate("district");
    res.status(200).json({ success: true, data: localChurch });
  } catch (err) {
    handleError(res, err, "An unknown error occured");
  }
};

// Create a new local church
export const createLocalChurch = async (req: Request, res: Response) => {
  const localChurch = new Local(req.body);

  try {
    const newLocalChurch = await localChurch.save();
    res.status(201).json(newLocalChurch);
  } catch (err) {
    handleError(res, err, "An unknown error occured");
  }
};

// Get a single local church by ID
export const getLocalChurchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const localChurch = await Local.findById(id).populate("district");

    if (!localChurch) {
      return res
        .status(404)
        .json({ success: false, message: "Local Church not found" });
    }

    res.status(200).json({ success: true, data: localChurch });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// Update local church by ID
export const updateLocalChurch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.district) {
      const district = await District.findById(updateData.district);

      if (!district) {
        return res.status(400).json({ message: "Invalid Local Church " });
      }
    }

    const updateLocal = await Local.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updateLocal) {
      return res.status(404).json({ message: "Local Church not found" });
    }

    res.status(200).json(updateLocal);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// Delete a Local church
export const deleteLocalChurch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteLocal = await Local.findByIdAndDelete(id);

    if (!deleteLocal) {
      return res
        .status(404)
        .json({ success: false, message: "Local not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Local Church deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
