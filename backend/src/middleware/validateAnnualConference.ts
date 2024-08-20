// [DEPENDENCIES]
import { Request, Response, NextFunction } from "express";
import Annual from "../models/Annual";

// [FUNCTION]
export const validateAnnualConference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.annualConference) {
    const annualConference = await Annual.findById(req.body.annualConference);
    if (!annualConference) {
      return res
        .status(400)
        .json({ message: "Invalid Annual Conference reference." });
    }
  }

  next();
};
