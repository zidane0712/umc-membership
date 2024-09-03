// [IMPORT]
import { Request, Response, NextFunction } from "express";

// [FUNCTION]
const asyncHandler = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
};

export default asyncHandler;
