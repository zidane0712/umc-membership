// [IMPORT]
import { Request, Response, NextFunction } from "express";

// Custom error classes
class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "CustomError";
  }
}

class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

class DatabaseError extends CustomError {
  constructor(message: string) {
    super(message, 500);
    this.name = "DatabaseError";
  }
}

// [MIDDLEWARES]
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Default to 500 if error type is unknown
  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
};
