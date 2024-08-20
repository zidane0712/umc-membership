// [DEPENDENCIES]
import { Response } from "express";

// [FUNCTION]
export function handleError(
  res: Response,
  err: unknown,
  defaultMessage: string
) {
  if (err instanceof Error) {
    res.status(500).json({ message: err.message });
  } else {
    res.status(500).json({ message: defaultMessage });
  }
}
