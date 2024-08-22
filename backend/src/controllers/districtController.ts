// [DEPENDENCIES]
import { NextFunction, Request, Response } from "express";

// [IMPORTS]
import District from "../models/District";
import Annual from "../models/Annual";
import { handleError } from "../utils/handleError";

// [CONTROLLERS]
// Gets all district
export const getAllDistrict = async (req: Request, res: Response) => {
  try {
    const districts = await District.find().populate("annualConference");
    res.status(200).json({ success: true, data: districts });
  } catch (err) {
    handleError(res, err, "An unknown error occured");
  }
};

// Create a new district
export const createDistrict = async (req: Request, res: Response) => {
  const { name, annualConference } = req.body;

  try {
    // Manually check if district conference already exists
    const existingDistrictConference = await District.findOne({
      name,
      annualConference,
    });

    if (existingDistrictConference) {
      return res.status(409).json({
        success: false,
        message:
          "A district conference with this name and annual conference already exists.",
      });
    }

    // If it doesn't exist, create a new one
    const districtConference = new District(req.body);
    const newDistrict = await districtConference.save();
    res.status(201).json(newDistrict);
  } catch (err) {
    handleError(res, err, "An unknown error occured");
  }
};

// Get a single district by ID
export const getDistrictById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const district = await District.findById(id).populate("annualConference");

    if (!district) {
      return res
        .status(404)
        .json({ success: false, message: "District not found" });
    }

    res.status(200).json({ success: true, data: district });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// Update district by ID
export const updateDistrict = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, annualConference } = req.body;

    // Check if there's another district conference with same name and annual conference
    const existingDistrictConference = await District.findOne({
      name,
      annualConference,
      _id: { $ne: id },
    });

    if (existingDistrictConference) {
      return res.status(409).json({
        success: false,
        message:
          "A district conference with this name and annual conference already exists.",
      });
    }

    if (annualConference) {
      const annualConferenceCheck = await Annual.findById(annualConference);
      if (!annualConferenceCheck) {
        return res
          .status(400)
          .json({ message: "Invalid Annual Conference reference" });
      }
    }

    const updateDistrict = await District.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateDistrict) {
      return res.status(404).json({ message: "Membership not found" });
    }

    res.status(200).json(updateDistrict);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// Delete a district
export const deleteDistrict = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteDistrict = await District.findByIdAndDelete(id);

    if (!deleteDistrict) {
      return res
        .status(404)
        .json({ success: false, message: "District not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "District deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
