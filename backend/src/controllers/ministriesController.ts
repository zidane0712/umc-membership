// [IMPORT]
// Express import
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
// Local import
import Local from "../models/Local";
import Membership from "../models/Membership";
import Ministry from "../models/Ministries";
import { handleError } from "../utils/handleError";

// [CONTROLLERS]

// Gets all ministries
export const getAllMinistry = async (req: Request, res: Response) => {
  try {
    const ministries = await Ministry.find()
      .populate("localChurch", "name")
      .populate("members", "name");
    res.status(200).json({ success: true, data: ministries });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all ministry");
  }
};

// Create a new ministry
export const createMinistry = async (req: Request, res: Response) => {
  const ministry = new Ministry(req.body);
  try {
    const newMinistry = await ministry.save();
    res.status(201).json(newMinistry);
  } catch (err) {
    handleError(res, err, "An error occurred while creating ministry");
  }
};

// Get a single ministry by ID
export const getMinistryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ministry = await Ministry.findById(id)
      .populate("localChurch", "name")
      .populate("members", "name");

    if (!ministry) {
      return res
        .status(404)
        .json({ success: false, message: "Ministry not found" });
    }

    res.status(200).json({ success: true, data: ministry });
  } catch (err) {
    handleError(res, err, "An error occurred while getting ministry");
  }
};

// Update a ministry by ID
export const updateMinistry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.local) {
      const localChurch = await Local.findById(updateData.localChurch);
      if (!localChurch) {
        return res
          .status(400)
          .json({ message: "Invalid Local Church reference." });
      }
    }

    const updateMinistry = await Ministry.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updateMinistry) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    res.status(200).json(updateMinistry);
  } catch (err) {
    handleError(res, err, "An error occurred while updating ministry");
  }
};

// Delete a ministry
export const deleteMinistry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteMinistry = await Ministry.findByIdAndDelete(id);

    if (!deleteMinistry) {
      return res
        .status(404)
        .json({ success: false, message: "Ministry not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Ministry deleted successfully" });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting ministry");
  }
};

// Add multiple members to a ministry
export const addMemberToMinistry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { memberIds }: { memberIds: mongoose.Types.ObjectId[] } = req.body;

    // Find the ministry by Id
    const ministry = await Ministry.findById(id);
    if (!ministry) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    // Initialize members array if undefined
    ministry.members = ministry.members || [];

    // Find the members by Ids
    const members = await Membership.find({ _id: { $in: memberIds } });
    const memberIdsSet = new Set(memberIds);

    if (members.length !== memberIds.length) {
      return res.status(404).json({ message: "One or more members not found" });
    }

    // Ensure members belong to the same local church as the ministry
    for (const member of members) {
      if (!member.localChurch.equals(ministry.localChurch)) {
        return res.status(400).json({
          message:
            "All members and the Ministry must belong to the same local church",
        });
      }
    }

    // Add members to the ministry if not already added
    const newMemberIds = memberIds.filter(
      (memberId) => !ministry.members!.includes(memberId)
    );
    if (newMemberIds.length > 0) {
      ministry.members.push(...newMemberIds);
      await ministry.save();
    }

    // Add the ministry to the members if not already added
    const updates = members.map(async (member) => {
      member.ministries = member.ministries || [];
      if (
        !member.ministries.some((ministryId) =>
          ministryId.equals(ministry._id as mongoose.Types.ObjectId)
        )
      ) {
        member.ministries.push(ministry._id as mongoose.Types.ObjectId);
        await member.save();
      }
    });
    await Promise.all(updates);

    res.status(200).json({
      success: true,
      message: "Members successfully added to Ministry",
    });
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while adding members to the ministry"
    );
  }
};
