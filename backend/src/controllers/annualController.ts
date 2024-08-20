// [DEPENDENCIES]
import { Request, Response } from "express";

// [IMPORTS]
import Annual from "../models/Annual";
import { handleError } from "../utils/handleError";

// [CONTROLLERS]

// Gets all annual conferences
export const getAllAnnual = async (req: Request, res: Response) => {
  try {
    const annualConferences = await Annual.find();
    res.json(annualConferences);
  } catch (err) {
    handleError(res, err, "An unknown error occured");
  }
};

// Add a new annual conference
export const createAnnual = async (req: Request, res: Response) => {
  const annualConference = new Annual(req.body);
  try {
    const newAnnual = await annualConference.save();
    res.status(201).json(newAnnual);
  } catch (err) {
    handleError(res, err, "An unknown error occured");
  }
};

// Get a single annual conference by ID
export const getAnnualById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const annual = await Annual.findById(id);

    if (!annual) {
      return res
        .status(404)
        .json({ success: false, message: "Annual not found" });
    }

    res.status(200).json({ success: true, data: annual });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// Update an annual conference by ID
export const updateAnnual = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedAnnual = await Annual.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedAnnual) {
      return res
        .status(404)
        .json({ success: false, message: "Annual Conference not found" });
    }

    res.status(200).json({ success: true, data: updatedAnnual });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// Delete an Annual Conference by ID
export const deleteAnnual = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedAnnual = await Annual.findByIdAndDelete(id);

    if (!deletedAnnual) {
      return res
        .status(404)
        .json({ success: false, message: "Annual conference not found" });
    }

    res.status(200).json({
      success: true,
      message: "Annual conference deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
