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
  const district = new District(req.body);
  try {
    const newDistrict = await district.save();
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
    const updateData = req.body;

    if (updateData.annualConference) {
      const annualConference = await Annual.findById(
        updateData.annualConference
      );
      if (!annualConference) {
        return res
          .status(400)
          .json({ message: "Invalid Annual Conference reference" });
      }
    }

    const updateDistrict = await District.findByIdAndUpdate(id, updateData, {
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
