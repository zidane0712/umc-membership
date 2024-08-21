// [DEPENDENCIES]
import { NextFunction, Request, Response } from "express";

// [IMPORTS]
import Membership from "../models/Membership";
import Annual from "../models/Annual";
import { handleError } from "../utils/handleError";
import District from "../models/District";
import Local from "../models/Local";
import Ministry from "../models/Ministries";
import mongoose from "mongoose";

// [CONTROLLERS]

// Gets all membership
export const getAllMemberships = async (req: Request, res: Response) => {
  try {
    const memberships = await Membership.find()
      .populate("annualConference")
      .populate("district")
      .populate("localChurch")
      .populate("ministries");
    res.status(200).json({ success: true, data: memberships });
  } catch (err) {
    handleError(res, err, "An unknown error occured");
  }
};

// Create a new membership
export const createMembership = async (req: Request, res: Response) => {
  const membership = new Membership(req.body);
  try {
    const newMembership = await membership.save();
    res.status(201).json(newMembership);
  } catch (err) {
    handleError(res, err, "An unknown error occured");
  }
};

// Get a single membership by ID
export const getMemberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const member = await Membership.findById(id)
      .populate("annualConference")
      .populate("district")
      .populate("localChurch")
      .populate("ministries");

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
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
    const updateData = req.body;

    if (updateData.annualConference) {
      const annualConference = await Annual.findById(
        updateData.annualConference
      );
      if (!annualConference) {
        return res
          .status(400)
          .json({ message: "Invalid Annual Conference reference." });
      }
    }

    if (updateData.district) {
      const district = await District.findById(updateData.district);
      if (!district) {
        return res
          .status(400)
          .json({ message: "Invalid District Conference reference." });
      }
    }

    if (updateData.local) {
      const localChurch = await Local.findById(updateData.localChurch);
      if (!localChurch) {
        return res
          .status(400)
          .json({ message: "Invalid Local Church reference." });
      }
    }

    const updateMembership = await Membership.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updateMembership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    res.status(200).json(updateMembership);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
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
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
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
