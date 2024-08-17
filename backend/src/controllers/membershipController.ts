// [DEPENDENCIES]
import { Request, Response } from "express";

// [IMPORTS]
import Membership from "../models/Membership";

// [CONTROLLERS]

// Gets all membership
export const getAllMemberships = async (req: Request, res: Response) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// Create a new membership
export const createMembership = async (req: Request, res: Response) => {
  const membership = new Membership(req.body);
  try {
    const newMembership = await membership.save();
    res.status(201).json(newMembership);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
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
export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedMember = await Membership.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedMember) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.status(200).json({ success: true, data: updatedMember });
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
