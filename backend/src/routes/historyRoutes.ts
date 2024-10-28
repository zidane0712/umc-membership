// [IMPORT]
// Global import
import express, { Request, Response, NextFunction } from "express";
// Local import
import {
  createHistorySchema,
  updateHistorySchema,
} from "../validators/historyValidator";
import { getAllHistory } from "../controllers/historyController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { validateLocalChurch } from "../middleware/validateLocalChurch";

const router = express.Router();

// [ROUTES]
router.route("/").get(asyncHandler(getAllHistory));

router.use(errorHandler);

// [EXPORT]
export default router;
