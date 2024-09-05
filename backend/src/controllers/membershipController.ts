// [IMPORT]
// Express import
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
// Local import
import { handleError } from "../utils/handleError";
import Membership from "../models/Membership";
import Annual from "../models/Annual";
import District from "../models/District";
import Local from "../models/Local";
import Ministry from "../models/Ministries";
import Counter from "../models/Counter";

// [CONTROLLERS]
// Gets all membership
export const getAllMemberships = async (req: Request, res: Response) => {
  try {
    const memberships = await Membership.find()
      .populate("localChurch", "name")
      .populate("ministries", "name");
    res.status(200).json({ success: true, data: memberships });
  } catch (err) {
    handleError(res, err, "An error occurred while getting all member");
  }
};

// Create a new membership
export const createMembership = async (req: Request, res: Response) => {
  const { name, district, localChurch } = req.body;

  try {
    // Check if a membership already exists with the same name, district, and local church
    const existingMembership = await Membership.findOne({
      name,
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message: "A membership with this name already exists.",
      });
    }

    // Get the next sequence number from a counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: "membershipshipId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Generate custom Id
    const customId = `UMC-${counter?.seq.toString().padStart(5, "0")}`;

    // If it doesn't exist, create a new membership
    const membership = new Membership({ ...req.body, customId });
    const newMembership = await membership.save();

    res.status(201).json(newMembership);
  } catch (err) {
    handleError(res, err, "An error occurred while creating member");
  }
};

// Get a single membership by ID
export const getMemberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const member = await Membership.findById(id)
      .populate("annualConference", "name")
      .populate("district", "name")
      .populate("localChurch", "name")
      .populate("ministries", "name");

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.status(200).json({ success: true, data: member });
  } catch (err) {
    handleError(res, err, "An error occurred while getting member by id");
  }
};

// Update a member by ID
export const updateMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, localChurch, district, annualConference } = req.body;

    // Check if there's another membership with same name, district, and annual conference
    const existingMembership = await Membership.findOne({
      name,
      localChurch,
      district,
      annualConference,
      _id: { $ne: id },
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message:
          "A membership with this name, localChurch, district, and annual conference already exists.",
      });
    }

    if (annualConference) {
      const annualConferenceCheck = await Annual.findById(annualConference);
      if (!annualConferenceCheck) {
        return res
          .status(400)
          .json({ message: "Invalid Annual Conference reference." });
      }
    }

    if (district) {
      const districtCheck = await District.findById(district);
      if (!districtCheck) {
        return res
          .status(400)
          .json({ message: "Invalid District Conference reference." });
      }
    }

    if (localChurch) {
      const localChurchCheck = await Local.findById(localChurch);
      if (!localChurchCheck) {
        return res
          .status(400)
          .json({ message: "Invalid Local Church reference." });
      }
    }

    const updateMembership = await Membership.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateMembership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    res.status(200).json(updateMembership);
  } catch (err) {
    handleError(res, err, "An error occurred while updating member");
  }
};

// Delete a member
export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedMember = await Membership.findByIdAndDelete(id);

    if (!deletedMember) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Member deleted successfully" });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting member");
  }
};

// Add multiple ministries to a member
export const addMinistriesToMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ministryIds }: { ministryIds: mongoose.Types.ObjectId[] } =
      req.body;

    // Find the member by ID
    const member = await Membership.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Initialize ministries array if undefined
    member.ministries = member.ministries || [];

    // Find the ministries by IDs
    const ministries = await Ministry.find({ _id: { $in: ministryIds } });
    const ministryIdsSet = new Set(ministryIds);

    if (ministries.length !== ministryIds.length) {
      return res
        .status(404)
        .json({ message: "One or more ministries not found" });
    }

    // Ensure ministries belong to the same local church as the member
    for (const ministry of ministries) {
      if (!ministry.localChurch.equals(ministry.localChurch)) {
        return res.status(400).json({
          message:
            "All members and the Ministry must belong to the same local church",
        });
      }
    }

    // Add ministries to the member if not already added
    const newMinistryIds = ministryIds.filter(
      (ministryId) => !member.ministries!.includes(ministryId)
    );
    if (newMinistryIds.length > 0) {
      member.ministries.push(...newMinistryIds);
      await member.save();
    }

    // Add the member to each ministry if not already added
    const updates = ministries.map(async (ministry) => {
      ministry.members = ministry.members || [];
      if (
        !ministry.members.some((memberId) =>
          memberId.equals(member._id as mongoose.Types.ObjectId)
        )
      ) {
        ministry.members.push(member._id as mongoose.Types.ObjectId);
        await ministry.save();
      }
    });
    await Promise.all(updates);

    res.status(200).json({
      success: true,
      message: "Ministries successfully added to member",
    });
  } catch (err) {
    handleError(
      res,
      err,
      "An error occurred while adding ministries to the member"
    );
  }
};
