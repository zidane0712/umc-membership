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
import { AuthenticatedRequest } from "../middleware/authorize";
import Log from "../models/Logs";

// [CONTROLLERS]

// Gets all ministries
export const getAllMinistry = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Extract query parameters from the request
    const { name } = req.query;

    const userLocalChurch = req.user?.localChurch;

    // Create a filter object to hold the query conditions
    const filter: any = { localChurch: userLocalChurch };

    // If 'name' is provided, use a case-insensitive regular expression for searching
    if (name) {
      filter.name = { $regex: new RegExp(name as string, "i") };
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
export const createMinistry = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { name, localChurch } = req.body;

    const userLocalChurch = req.user?.localChurch;

    if (!userLocalChurch?.equals(localChurch)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to local church",
      });
    }

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

    // Log the action done
    await Log.create({
      action: "created",
      collection: "Ministry",
      documentId: newMinistry._id,
      data: newMinistry.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res.status(201).json(newMinistry);
  } catch (err) {
    handleError(res, err, "An error occurred while creating ministry");
  }
};

// Get a single ministry by ID
export const getMinistryById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userLocalChurch = req.user?.localChurch;

    const ministry = await Ministry.findById(id)
      .populate("localChurch", "name")
      .populate("members", "name");

    if (!ministry) {
      return res
        .status(404)
        .json({ success: false, message: "Ministry not found" });
    }

    // Check if the ministry's local church matches the user's local church
    if (!ministry.localChurch.equals(userLocalChurch)) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access to ministry" });
    }

    res.status(200).json({ success: true, data: ministry });
  } catch (err) {
    handleError(res, err, "An error occurred while getting ministry");
  }
};

// Update a ministry by ID
export const updateMinistry = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, localChurch } = req.body;

    const userLocalChurch = req.user?.localChurch;

    // Check if the input localChurch matches the user's localChurch
    if (!userLocalChurch?.equals(localChurch)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to local church",
      });
    }

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

    // Log the action done
    await Log.create({
      action: "updated",
      collection: "Ministry",
      documentId: updateMinistry._id,
      data: { prevData: updateMinistry.toObject(), newData: req.body },
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res.status(200).json(updateMinistry);
  } catch (err) {
    handleError(res, err, "An error occurred while updating ministry");
  }
};

// Delete a ministry
export const deleteMinistry = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userLocalChurch = req.user?.localChurch;

    const ministry = await Ministry.findById(id);

    if (!ministry) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    if (!ministry.localChurch.equals(userLocalChurch)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to local church",
      });
    }

    await ministry.deleteOne();

    // Log the action done
    await Log.create({
      action: "deleted",
      collection: "Ministry",
      documentId: ministry._id,
      data: ministry.toObject(),
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res
      .status(200)
      .json({ success: true, message: "Ministry deleted successfully" });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting ministry");
  }
};

// Add multiple members to a ministry
export const addMemberToMinistry = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { memberIds }: { memberIds: mongoose.Types.ObjectId[] } = req.body;

    const userLocalChurch = req.user?.localChurch;

    // Find the ministry by Id and initialize the members array if undefined
    const ministry = await Ministry.findById(id);
    if (!ministry) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    // Ensure the ministry belongs to the same local church as the logged-in user
    if (!ministry.localChurch.equals(userLocalChurch)) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access: Ministry does not belong to your local church",
      });
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

    // Log the action done
    await Log.create({
      action: "updated",
      collection: "Ministry",
      documentId: ministry._id,
      data: {
        prevData: ministry.toObject(),
        newData: { members: newMemberIds },
      },
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

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

// Remove members from a ministry
export const removeMembersFromMinistry = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { memberIds }: { memberIds: mongoose.Types.ObjectId[] } = req.body;

    const userLocalChurch = req.user?.localChurch;

    // Find the ministry by Id and initialize the members array if undefined
    const ministry = await Ministry.findById(id);
    if (!ministry) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    // Ensure the ministry belongs to the same local church as the logged-in user
    if (!ministry.localChurch.equals(userLocalChurch)) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access: Ministry does not belong to your local church",
      });
    }

    ministry.members = ministry.members || []; // Ensure members array is initialized

    // Filter for valid memberIds that are currently in the ministry
    const membersToRemove = memberIds.filter((memberId) =>
      ministry.members!.includes(memberId)
    );

    if (membersToRemove.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching members found in the ministry" });
    }

    // Update the Ministry using findOneAndUpdate to remove the members
    await Ministry.findOneAndUpdate(
      { _id: id },
      { $pull: { members: { $in: membersToRemove } } },
      { new: true } // Return the updated document
    );

    // Update each member to remove the ministry reference
    const updates = membersToRemove.map(async (memberId) => {
      await Membership.findOneAndUpdate(
        { _id: memberId },
        { $pull: { ministries: ministry._id } },
        { new: true } // Return the updated document
      );
    });

    await Promise.all(updates);

    // Log the action done
    await Log.create({
      action: "updated",
      collection: "Ministry",
      documentId: ministry._id,
      data: {
        prevData: ministry.toObject(),
        newData: { members: membersToRemove },
      },
      performedBy: req.user?._id,
      timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Members successfully removed from Ministry",
    });
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while removing members from the ministry"
    );
  }
};
