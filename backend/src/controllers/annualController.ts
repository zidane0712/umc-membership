// [IMPORT]
// Global import
import { Request, Response } from "express";
// Local import
import { handleError } from "../utils/handleError";
import Annual from "../models/Annual";
import Counter from "../models/Counter";

// [CONTROLLERS]
// Gets all annual conferences
export const getAllAnnual = async (req: Request, res: Response) => {
  try {
    const { episcopalArea, search } = req.query;

    // Define a filter object, initially empty
    const filter: { [key: string]: any } = {};

    // If episcopalArea is provided, add it to the filter
    if (episcopalArea) {
      filter.episcopalArea = episcopalArea;
    }

    // If search is provided, perform a case-insensitive search on specific fields
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { episcopalArea: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch the annual conferences based on the filter
    const annualConferences = await Annual.find(filter);

    res.status(200).json({ success: true, data: annualConferences });
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while getting all annual conferences"
    );
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

    // Get the next sequence number from a counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: "annualId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate custom Id
    const customId = `AC-${counter?.seq.toString().padStart(4, "0")}`;

    const annualConference = new Annual({ ...req.body, customId });
    const newAnnualConference = await annualConference.save();
    res.status(201).json(newAnnualConference);
  } catch (err) {
    handleError(res, err, "An error occurred while creating annual conference");
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
  } catch (err) {
    handleError(res, err, "An error occurred while getting annual conference");
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
  } catch (err) {
    handleError(res, err, "An error occurred while updating annual conference");
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
        .json({ success: false, message: "Annual Conference not found" });
    }

    res.status(200).json({
      success: true,
      message: "Annual Conference deleted successfully",
    });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting annual conference");
  }
};
