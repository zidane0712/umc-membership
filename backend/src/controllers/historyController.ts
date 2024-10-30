// [IMPORT]
// Global import
import { Request, Response } from "express";
import { Types } from "mongoose";
// Local import
import { handleError } from "../utils/handleError";
import History from "../models/History";
import Counter from "../models/Counter";
import Membership from "../models/Membership";

// [CONTROLLERS]
// Get all history
export const getAllHistory = async (req: Request, res: Response) => {
  try {
    const { historian, title, startDate, endDate, tags } = req.query;

    const pipeline: any[] = [
      {
        $lookup: {
          from: "memberships",
          localField: "historian",
          foreignField: "_id",
          as: "historian",
        },
      },
      {
        $unwind: "$historian",
      },
      {
        $project: {
          title: 1,
          date: 1,
          content: 1,
          tags: 1,
          mediaLink: 1,
          customId: 1,
          createdAt: 1,
          updatedAt: 1,
          historian: {
            _id: "$historian._id",
            name: {
              firstname: "$historian.name.firstname",
              middlename: "$historian.name.middlename",
              lastname: "$historian.name.lastname",
            },
          },
        },
      },
    ];

    // Apply filters based on query parameters

    if (historian) {
      pipeline.unshift({
        $match: { historian: new Types.ObjectId(historian as string) },
      });
    }

    if (title) {
      pipeline.push({
        $match: {
          title: { $regex: new RegExp(title as string, "i") },
        },
      });
    }

    if (startDate && endDate) {
      pipeline.push({
        $match: {
          date: {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
          },
        },
      });
    } else if (startDate) {
      pipeline.push({
        $match: {
          date: {
            $gte: new Date(startDate as string),
          },
        },
      });
    } else if (endDate) {
      pipeline.push({
        $match: {
          date: {
            $lte: new Date(endDate as string),
          },
        },
      });
    }

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      pipeline.push({
        $match: { tags: { $in: tagsArray } },
      });
    }

    const histories = await History.aggregate(pipeline);

    res.status(200).json({ success: true, data: histories });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all histories");
  }
};

// Create new history
export const createHistory = async (req: Request, res: Response) => {
  const { date, historian, localChurch, title, content, tags, mediaLink } =
    req.body;

  try {
    // Check if date is in the future
    if (date && new Date(date) > new Date()) {
      return res.status(400).json({
        success: false,
        message: "Date must not be greater than the current date",
      });
    }

    // Check if a history exists with the same date and local church
    const existingHistory = await History.findOne({
      date,
      title,
      localChurch,
    });

    if (existingHistory) {
      return res.status(409).json({
        success: false,
        message:
          "History already exists in this local church with the same date",
      });
    }

    // Find historian Id if exists
    const historianCheck = await Membership.findById(historian);
    if (!historianCheck) {
      return res.status(404).json({ message: "Historian not found" });
    }

    // Get the next sequence number from a counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: "historyId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate custom Id
    const customId = `HLC-${counter?.seq.toString().padStart(4, "0")}`;

    // Create a new History
    const history = new History({
      date,
      title,
      content,
      historian,
      tags,
      mediaLink,
      localChurch,
      customId,
    });

    // Save history and response
    const newHistory = await history.save();
    res.status(201).json({
      success: true,
      data: newHistory,
    });
  } catch (err) {
    handleError(res, err, "An error occurred while creating the history");
  }
};

// Get history by id
export const getHistoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const history = await History.findById(id)
      .populate("localChurch", "name")
      .populate("historian", "name");

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    res.status(200).json({ success: true, data: history });
  } catch (err) {
    handleError(res, err, "An error occurred while getting history");
  }
};

// Update history by id
export const updateHistory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, historian, title, content, tags, localChurch, mediaLink } =
    req.body;

  try {
    // Check if the history exists with the provided Id
    const existingHistoryById = await History.findById(id);
    if (!existingHistoryById) {
      return res.status(404).json({
        success: false,
        message: "History not found with the provided ID.",
      });
    }

    if (date && new Date(date) > new Date()) {
      return res.status(400).json({
        success: false,
        message: "Date must not be greater than the current date",
      });
    }

    // Check if the historian exists in Membership and belongs to the specified localChurch
    const historianCheck = await Membership.findOne({
      _id: historian,
      localChurch,
    });

    if (!historianCheck) {
      return res.status(404).json({
        success: false,
        message: "Historian not found in the specified local church.",
      });
    }

    // Check for existing history in the same local church with the same name and date
    const existingHistory = await History.findOne({
      _id: { $ne: id },
      title,
      localChurch,
      date,
    });

    if (existingHistory) {
      return res.status(409).json({
        success: false,
        message:
          "A history with the same name and date already exists in this local church",
      });
    }

    // Update the history document
    const updatedHistory = await History.findByIdAndUpdate(
      id,
      { date, historian, localChurch, title, content, tags, mediaLink },
      { new: true }
    );

    if (!updatedHistory) {
      return res
        .status(404)
        .json({ success: false, message: "History not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedHistory,
    });
  } catch (err) {
    handleError(res, err, "An error occurred while updating the history");
  }
};

// Delete history
export const deleteHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteHistory = await History.findByIdAndDelete(id);

    if (!deleteHistory) {
      return res
        .status(404)
        .json({ success: false, message: "History not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "History delete successfully" });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting history");
  }
};
