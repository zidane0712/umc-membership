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
    res.status(200).json({ success: true, data: annualConferences });
  } catch (err) {
    handleError(res, err, "An unknown error occured");
  }
};

// Add a new annual conference
export const createAnnual = async (req: Request, res: Response) => {
  const { name, episcopalArea } = req.body;

  try {
    // Manually check if the annual conference already exists
    const existingAnnualConference = await Annual.findOne({
      name,
      episcopalArea,
    });

    if (existingAnnualConference) {
      return res.status(409).json({
        success: false,
        message:
          "An annual conference with this name and episcopal area already exists",
      });
    }

    const annualConference = new Annual(req.body);
    const newAnnualConference = await annualConference.save();
    res.status(201).json(newAnnualConference);
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
    const { name, episcopalArea } = req.body;

    // Check if there's another annual conference with the same name and episcopal area
    const existingAnnualConference = await Annual.findOne({
      name,
      episcopalArea,
      _id: { $ne: id },
    });

    if (existingAnnualConference) {
      return res.status(409).json({
        success: false,
        message:
          "An annual conference with this name and episcopal area already exists.",
      });
    }

    const updateAnnual = await Annual.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updateAnnual) {
      return res
        .status(404)
        .json({ success: false, message: "Annual Conference not found" });
    }

    res.status(200).json({ success: true, data: updateAnnual });
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
