// [IMPORT]
// Express import
import { NextFunction, Request, Response } from "express";
// Local import
import { handleError } from "../utils/handleError";
import District from "../models/District";
import Annual from "../models/Annual";
import Counter from "../models/Counter";
import { AuthenticatedRequest } from "../middleware/authorize";
import Log from "../models/Logs";

// [CONTROLLERS]
// Gets all district
export const getAllDistrict = async (req: Request, res: Response) => {
  try {
    const { episcopalArea, search, page = 1, limit = 10 } = req.query;

    // Convert pagination params to numbers
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;

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
          "annualConference._id": 1,
          "annualConference.name": 1,
          "annualConference.episcopalArea": 1,
        },
      },
    ];

    // Add episcopalArea filter if provided
    if (episcopalArea) {
      pipeline.push({
        $match: {
          "annualConference.episcopalArea": episcopalArea,
        },
      });
    }

    // Add search filter if provided
    if (search) {
      pipeline.push({
        $match: {
          name: { $regex: search, $options: "i" },
        },
      });
    }

    // Add sorting
    pipeline.push({
      $sort: { name: 1 },
    });

    // Add pagination
    pipeline.push({ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum });

    // Execute the aggregation pipeline
    const districts = await District.aggregate(pipeline);

    // Get total count for pagination metadata
    const totalCountPipeline = pipeline.filter(
      (stage) => !("$skip" in stage || "$limit" in stage)
    );
    const totalCount = await District.aggregate([
      ...totalCountPipeline,
      { $count: "total" },
    ]);

    const count = totalCount[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: districts,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while getting all district conferences"
    );
  }
};

// Create a new district
export const createDistrict = async (
  req: AuthenticatedRequest,
  res: Response
) => {
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

    // Log the action done
    await Log.create({
      action: "created",
      collection: "District",
      documentId: newDistrict._id,
      data: newDistrict.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

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

    // Fetch the district with the given ID and populate annualConference fields
    const district = await District.findById(id).populate(
      "annualConference",
      "name episcopalArea"
    );

    // Check if the district exists
    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    res.status(200).json({
      success: true,
      data: district,
    });
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while getting district conference"
    );
  }
};

// Update district by ID
export const updateDistrict = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, annualConference } = req.body;

    const existingDistrict = await District.findById(id);
    if (!existingDistrict) {
      return res.status(404).json({
        success: false,
        message: "District not found with the provided ID.",
      });
    }

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

    const updatedDistrict = await District.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedDistrict) {
      return res.status(404).json({ message: "District not found" });
    }

    // Log the action done
    await Log.create({
      action: "updated",
      collection: "District",
      documentId: updatedDistrict._id,
      data: updatedDistrict.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

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
export const deleteDistrict = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Check if the district with the provided ID exists
    const existingDistrict = await District.findById(id);
    if (!existingDistrict) {
      return res.status(404).json({
        success: false,
        message: "District not found with the provided ID.",
      });
    }

    const deletedDistrict = await District.findByIdAndDelete(id);

    if (!deletedDistrict) {
      return res
        .status(404)
        .json({ success: false, message: "District not found" });
    }

    // Log the action done
    await Log.create({
      action: "deleted",
      collection: "District",
      documentId: deletedDistrict._id,
      data: deletedDistrict.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

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
