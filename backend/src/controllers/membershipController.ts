// [DEPENDENCIES]
import { Request, Response } from "express";
import Membership from "../models/Membership";

// [FUNCTIONS]
export const getMemberships = async (req: Request, res: Response) => {
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
