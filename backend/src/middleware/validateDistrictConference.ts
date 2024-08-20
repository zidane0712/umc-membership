// [DEPENDENCIES]
import { Request, Response, NextFunction } from "express";
import District from "../models/District";

// [FUNCTION]
export const validateDistrictConference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.district) {
    const districtConference = await District.findById(req.body.district);

    if (!districtConference) {
      return res
        .status(400)
        .json({ message: "Invalid District Conference reference." });
    }
  }

  next();
};
