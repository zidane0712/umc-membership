// [IMPORT]
// Express import
import { NextFunction, Request, Response } from "express";
// Local import
import Local from "../models/Local";
import District from "../models/District";
import Annual from "../models/Annual";
import { handleError } from "../utils/handleError";

// [CONTROLLERS]
// Get all local church
export const getAllLocalChurch = async (req: Request, res: Response) => {
  try {
    const localChurch = await Local.find()
      .populate("district", "name")
      .populate("annualConference", "name");
    res.status(200).json({ success: true, data: localChurch });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all local church");
  }
};

// Create a new local church
export const createLocalChurch = async (req: Request, res: Response) => {
  const { name, district, annualConference } = req.body;

  try {
    // Manually check if the local church already exists
    const existingLocalChurch = await Local.findOne({
      name,
      district,
      annualConference,
    });

    if (existingLocalChurch) {
      return res.status(409).json({
        success: false,
        message:
          "A local church with this name, district, and annual conference already exists.",
      });
    }

    // If it doesn't exist, create a new one
    const localChurch = new Local(req.body);
    const newLocalChurch = await localChurch.save();
    res.status(201).json(newLocalChurch);
  } catch (err) {
    handleError(res, err, "An error occurred while creating local church");
  }
};

// Get a single local church by ID
export const getLocalChurchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const localChurch = await Local.findById(id)
      .populate("district", "name")
      .populate("annualConference", "name");

    if (!localChurch) {
      return res
        .status(404)
        .json({ success: false, message: "Local Church not found" });
    }

    res.status(200).json({ success: true, data: localChurch });
  } catch (err) {
    handleError(res, err, "An error occurred while getting local church");
  }
};

// Update local church by ID
export const updateLocalChurch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, district, annualConference } = req.body;

    // Check if there's another local church with same name, district, and annual conference
    const existingLocalChurch = await Local.findOne({
      name,
      district,
      annualConference,
      _id: { $ne: id },
    });

    if (existingLocalChurch) {
      return res.status(409).json({
        success: false,
        message:
          "A local church with this name, district, and annual conference already exists.",
      });
    }

    if (district) {
      const districtCheck = await District.findById(district);

      if (!districtCheck) {
        return res
          .status(400)
          .json({ message: "Invalid District Conference " });
      }
    }

    if (annualConference) {
      const annualCheck = await Annual.findById(annualConference);

      if (!annualCheck) {
        return res.status(400).json({ message: "Invalid Annual Conference " });
      }
    }

    const updateLocal = await Local.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updateLocal) {
      return res.status(404).json({ message: "Local Church not found" });
    }

    res.status(200).json(updateLocal);
  } catch (err) {
    handleError(res, err, "An error occurred while updating local church");
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
  } catch (err) {
    handleError(res, err, "An error occurred while deleting local church");
  }
};
