// [DEPENDENCIES]
import { Request, Response, NextFunction } from "express";

// [MIDDLEWARES]
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
};
