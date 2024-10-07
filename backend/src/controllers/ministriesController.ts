// [IMPORT]
// Express import
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
// Local import
import Local from "../models/Local";
import Membership from "../models/Membership";
import Ministry from "../models/Ministries";
import { handleError } from "../utils/handleError";
import Counter from "../models/Counter";

// [CONTROLLERS]

// Gets all ministries
export const getAllMinistry = async (req: Request, res: Response) => {
  try {
    // Extract query parameters from the request
    const { name, localChurch } = req.query;

    // Create a filter object to hold the query conditions
    const filter: any = {};

    // If 'name' is provided, use a case-insensitive regular expression for searching
    if (name) {
      filter.name = { $regex: new RegExp(name as string, "i") };
    }

    // If 'localChurch' is provided, add it to the filter
    if (localChurch) {
      filter.localChurch = localChurch;
    }

    // Find ministries based on the filter and populate related fields
    const ministries = await Ministry.find(filter)
      .populate("localChurch", "name")
      .populate("members", "name");

    res.status(200).json({ success: true, data: ministries });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all ministries");
  }
};

// Create a new ministry
export const createMinistry = async (req: Request, res: Response) => {
  const { name, localChurch } = req.body;

  try {
    // Manually check if ministry exists in the local church
    const existingMinistry = await Ministry.findOne({
      name,
      localChurch,
    });

    if (existingMinistry) {
      return res.status(409).json({
        success: false,
        message:
          "A ministry with this name in the local church already exists.",
      });
    }

    // Get the next sequence number from a counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: "ministryId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate custom id
    const customId = `MLC-${counter?.seq.toString().padStart(4, "0")}`;

    // If it doesn't exist, create a new one
    const ministry = new Ministry({ ...req.body, customId });
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
    const { name, localChurch } = req.body;

    const existingMinistry = await Ministry.findOne({
      name,
      localChurch,
      _id: { $ne: id },
    });

    if (existingMinistry) {
      return res.status(409).json({
        success: false,
        message: "A ministry with this name in the local church already exists",
      });
    }

    if (localChurch) {
      const localChurchCheck = await Local.findById(localChurch);
      if (!localChurchCheck) {
        return res
          .status(400)
          .json({ message: "Invalid Local Church reference." });
      }
    }

    const updateMinistry = await Ministry.findByIdAndUpdate(id, req.body, {
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

    // Find the ministry by Id and initialize the members array if undefined
    const ministry = await Ministry.findById(id);
    if (!ministry) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    ministry.members = ministry.members || [];

    // Find the members by Ids
    const members = await Membership.find({ _id: { $in: memberIds } });
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

    // Filter out the members that are already in the ministry
    const newMemberIds = memberIds.filter(
      (memberId) => !ministry.members!.includes(memberId)
    );

    // Update the Ministry using findOneAndUpdate
    if (newMemberIds.length > 0) {
      await Ministry.findOneAndUpdate(
        { _id: id },
        { $addToSet: { members: { $each: newMemberIds } } },
        { new: true } // Return the updated document
      );
    }

    // Update each member to add the ministry if not already present
    const updates = members.map(async (member) => {
      await Membership.findOneAndUpdate(
        { _id: member._id },
        { $addToSet: { ministries: ministry._id } },
        { new: true } // Return the updated document
      );
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
