// [DEPENDENCIES]
import { Request, Response, NextFunction } from "express";
import Annual from "../models/Annual";

// [FUNCTION]
export const validateAnnualConference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { annualConference } = req.body;

  try {
    const annual = await Annual.findById(annualConference);
    if (!annual) {
      return res.status(400).json({
        message: "Invalid annual conference ID. It does not exist",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: "Server erro while validating annual conference",
    });
  }
};
