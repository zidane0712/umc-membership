// [IMPORT]
// Global import
import { Request, Response } from "express";
import { Types } from "mongoose";
// Local import
import { handleError } from "../utils/handleError";
import Attendance from "../models/Attendance";
import Counter from "../models/Counter";
import { AuthenticatedRequest } from "../middleware/authorize";
import Local from "../models/Local";
import Log from "../models/Logs";

// [CONTROLLERS]
// Get all attendance
export const getAllAttendance = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { tags, activityName, date, page = 1, limit = 10 } = req.query;

    // Convert pagination params to numbers
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;

    // Define the aggregation pipeline
    const pipeline: any[] = [
      {
        $match: {},
      },
      {
        $lookup: {
          from: "locals",
          localField: "localChurch",
          foreignField: "_id",
          as: "localChurch",
        },
      },
      {
        $unwind: "$localChurch",
      },
      {
        $project: {
          activityName: 1,
          date: 1,
          description: 1,
          totalAttendees: 1,
          tags: 1,
          customId: 1,
          createdAt: 1,
          updatedAt: 1,
          localChurch: {
            _id: "$localChurch._id",
            name: "$localChurch.name",
          },
        },
      },
    ];

    // Restrict data based on user role
    if (req.user?.role === "local") {
      pipeline.push({
        $match: {
          "localChurch._id": req.user.localChurch,
        },
      });
    }

    // Filter by tags if provided
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      pipeline[0].$match.tags = { $in: tagsArray };
    }

    // Filter by activityName if provided
    if (typeof activityName === "string") {
      pipeline[0].$match.activityName = {
        $regex: new RegExp(activityName, "i"),
      };
    }

    // Filter by date if provided
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      pipeline[0].$match.date = {
        $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(parsedDate.setHours(23, 59, 59, 999)),
      };
    }

    // Add a $group stage to calculate the total attendees sum
    pipeline.push({
      $group: {
        _id: null,
        totalAttendeesSum: { $sum: "$totalAttendees" },
        records: { $push: "$$ROOT" },
      },
    });

    // Add sorting
    pipeline.push({
      $sort: { name: 1 },
    });

    // Add pagination
    pipeline.push({ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum });

    // Execute the aggregation pipeline
    const attendanceResults = await Attendance.aggregate(pipeline);

    const totalAttendeesSum =
      attendanceResults.length > 0 ? attendanceResults[0].totalAttendeesSum : 0;

    // Get total count of pagination metadata
    const totalCountPipeline = pipeline.filter(
      (stage) => !("$skip" in stage || "$limit" in stage)
    );
    const totalCount = await Attendance.aggregate([
      ...totalCountPipeline,
      { $count: "total" },
    ]);

    const count = totalCount[0]?.total || 0;

    res.status(200).json({
      success: true,
      totalAttendeesSum,
      data: attendanceResults.length > 0 ? attendanceResults[0].records : [],
      count:
        attendanceResults.length > 0 ? attendanceResults[0].records.length : 0,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (err) {
    handleError(res, err, "An error occurred while getting attendance.");
  }
};

// Create new attendance
export const createAttendance = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      date,
      activityName,
      description,
      localChurch,
      totalAttendees,
      tags,
    } = req.body;

    // Ensure localChurch field matches the logged-in user's local church
    if (localChurch !== req.user?.localChurch?.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access: You can only create attendance for your own local church",
      });
    }

    // Check if date is in the future
    if (date && new Date(date) > new Date()) {
      return res.status(400).json({
        success: false,
        message: "Date must not be greater than the current date",
      });
    }

    // Check if an activity exists with the same date and local church
    const existingActivity = await Attendance.findOne({
      date,
      activityName,
      localChurch,
    });

    if (existingActivity) {
      return res.status(409).json({
        success: false,
        message:
          "Activity already exists in this local church with the same date",
      });
    }

    // Get the next sequence number from a counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: "attendanceId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate custom Id
    const customId = `ALC-${counter?.seq.toString().padStart(4, "0")}`;

    // Create a new Attendace
    const attendance = new Attendance({
      date,
      activityName,
      description,
      localChurch,
      totalAttendees,
      tags,
      customId,
    });

    // Save the attendance and respond
    const newAttendance = await attendance.save();

    // Log the action done
    await Log.create({
      action: "created",
      collection: "Attendance",
      documentId: newAttendance._id,
      data: newAttendance.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      data: newAttendance,
    });
  } catch (err) {
    handleError(res, err, "An error occurred while creating the attendance");
  }
};

// Get attendance by id
export const getAttendanceById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Fetch the attendance
    const attendance = await Attendance.findById(id).populate(
      "localChurch",
      "_id name"
    );

    // Check if attendance exists
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    // Role-based restriction: Check if the user is authorized to access
    if (
      req.user?.role === "local" &&
      attendance.localChurch._id.toString() !== req.user.localChurch?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You are not authorized to access.",
      });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (err) {
    handleError(res, err, "An error occurred while getting attendance");
  }
};

// Update an attendance by id
export const updateAttendance = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const { date, activityName, description, localChurch, totalAttendees, tags } =
    req.body;

  try {
    // Check if the attendance with the provide id exists
    const existingAttendanceById = await Attendance.findById(id);

    if (!existingAttendanceById) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found with the provided id.",
      });
    }

    // Ensure localChurch field matches the logged-in user's local church
    if (localChurch !== req.user?.localChurch?.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access: You can only update attendance for your own local church.",
      });
    }

    // Check if the date is in the future
    if (date && new Date(date) > new Date()) {
      return res.status(400).json({
        success: false,
        message: "Activity date must not be greater than the current date.",
      });
    }

    // Check for existing attendance in the same local church with the same name and date.
    const existingAttendance = await Attendance.findOne({
      _id: { $ne: id },
      activityName,
      localChurch,
      date,
    });

    if (existingAttendance) {
      return res.status(409).json({
        success: false,
        message:
          "An attendance with the same name and date already exists in this local church.",
      });
    }

    // Update the attendance document
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      { date, activityName, description, localChurch, totalAttendees, tags },
      { new: true }
    );

    if (!updatedAttendance) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance not found" });
    }

    // Log the action done
    await Log.create({
      action: "updated",
      collection: "Attendance",
      documentId: updatedAttendance._id,
      data: updatedAttendance.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      data: updatedAttendance,
    });
  } catch (err) {
    handleError(res, err, "An error occurred while updating attendance");
  }
};

// Delete attendance
export const deleteAttendance = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Check if the attendance with the provided ID exists
    const existingAttendance = await Attendance.findById(id);
    if (!existingAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found with the provided ID.",
      });
    }

    // Ensure the localChurch field matches the logged-in user's localChurch
    if (
      existingAttendance.localChurch.toString() !==
      req.user?.localChurch?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access: You can only delete attendance for your own local church.",
      });
    }

    // Delete the attendance
    const deleteAttendance = await Attendance.findByIdAndDelete(id);

    if (!deleteAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    // Log the action done
    await Log.create({
      action: "deleted",
      collection: "Attendance",
      documentId: deleteAttendance._id,
      data: deleteAttendance.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting attendance");
  }
};
