// [DEPENDENCIES]
import { Request, Response, NextFunction } from "express";
import Local from "../models/Local";

// [FUNCTION]
export const validateLocalChurch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.local) {
    const localChurch = await Local.findById(req.body.local);

    if (!localChurch) {
      return res
        .status(400)
        .json({ message: "Invalid local Church reference." });
    }
  }

  next();
};
