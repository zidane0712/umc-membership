// [IMPORT]
// Global import
import { Request, Response } from "express";
import { Types } from "mongoose";
// Local import
import { handleError } from "../utils/handleError";
import Attendance from "../models/Attendance";
import Counter from "../models/Counter";

// [CONTROLLERS]
// Get all attendance
export const getAllAttendance = async (req: Request, res: Response) => {
  try {
    const { tags, activityName, date } = req.query;

    const pipeline: any[] = [
      {
        $match: {},
      },
    ];

    // Filter by tags if provided
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      pipeline[0].$match.tags = { $in: tagsArray };
    }

    // Filter by activityName if provided
    if (typeof activityName === "string") {
      pipeline[0].$match.activityName = {
        $regex: new RegExp(activityName, "i"), // Cast activityName as string
      };
    }

    // Filter by date if provided
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      pipeline[0].$match.date = {
        $gte: new Date(parsedDate.setHours(0, 0, 0, 0)), // Start of the day
        $lt: new Date(parsedDate.setHours(23, 59, 59, 999)), // End of the day
      };
    }

    // Fetch attendance records using the aggregate pipeline
    const attendanceRecords = await Attendance.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: attendanceRecords,
      count: attendanceRecords.length,
    });
  } catch (err) {
    handleError(res, err, "An error occurred while getting attendance.");
  }
};

// Create new attendance
export const createAttendance = async (req: Request, res: Response) => {
  const { date, activityName, description, localChurch, totalAttendees, tags } =
    req.body;

  try {
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
    res.status(201).json({
      success: true,
      data: newAttendance,
    });
  } catch (err) {
    handleError(res, err, "An error occurred while creating the attendance");
  }
};
