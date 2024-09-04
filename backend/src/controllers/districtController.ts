// [IMPORT]
// Express import
import { NextFunction, Request, Response } from "express";
// Local import
import { handleError } from "../utils/handleError";
import District from "../models/District";
import Annual from "../models/Annual";
import Counter from "../models/Counter";

// [CONTROLLERS]
// Gets all district
export const getAllDistrict = async (req: Request, res: Response) => {
  try {
    const { episcopalArea, search } = req.query;

    // Define the aggregation pipeline
    const pipeline: any[] = [
      {
        $lookup: {
          from: "annuals",
          localField: "annualConference",
          foreignField: "_id",
          as: "annualConference",
        },
      },
      {
        $unwind: "$annualConference",
      },
      {
        $project: {
          name: 1,
          customId: 1,
          "annualConference.name": 1,
          "annualConference.episcopalArea": 1,
        },
      },
    ];

    // If episcopalArea is provided, add it to the match stage
    if (episcopalArea) {
      pipeline.push({
        $match: {
          "annualConference.episcopalArea": episcopalArea,
        },
      });
    }

    // If search is provided, add it to the match stage
    if (search) {
      pipeline.push({
        $match: {
          name: { $regex: search, $options: "i" },
        },
      });
    }

    // Perform sorting if needed
    pipeline.push({
      $sort: { name: 1 },
    });

    // Execute the aggregation pipeline
    const districts = await District.aggregate(pipeline);

    res.status(200).json({ success: true, data: districts });
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while getting all district conferences"
    );
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

    // Get the next sequence number from a counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: "districtId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate custom Id
    const customId = `DC-${counter?.seq.toString().padStart(4, "0")}`;

    const districtConference = new District({ ...req.body, customId });
    const newDistrict = await districtConference.save();

    res.status(201).json(newDistrict);
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while creating district conference"
    );
  }
};

// Get a single district by ID
export const getDistrictById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const district = await District.findById(id).populate(
      "annualConference",
      "name episcopalArea"
    );

    if (!district) {
      return res
        .status(404)
        .json({ success: false, message: "District not found" });
    }

    res.status(200).json({ success: true, data: district });
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while getting district conference"
    );
  }
};

// Update district by ID
export const updateDistrict = async (req: Request, res: Response) => {
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
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while updating district conference"
    );
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
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while deleting district conference"
    );
  }
};
