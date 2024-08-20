// [DEPENDENCIES]
import { NextFunction, Request, Response } from "express";

// [IMPORTS]
import Membership from "../models/Membership";
import Annual from "../models/Annual";
import { handleError } from "../utils/handleError";

// [CONTROLLERS]

// Gets all membership
export const getAllMemberships = async (req: Request, res: Response) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
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
    const member = await Membership.findById(id);

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
