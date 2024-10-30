// [IMPORT]
// Global import
import express, { Request, Response, NextFunction } from "express";
// Local import
import {
  createHistorySchema,
  updateHistorySchema,
} from "../validators/historyValidator";
import { getAllHistory, createHistory } from "../controllers/historyController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { validateLocalChurch } from "../middleware/validateLocalChurch";

const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(asyncHandler(getAllHistory))
  .post(
    validate(createHistorySchema),
    validateLocalChurch,
    asyncHandler(createHistory)
  );

router.use(errorHandler);

// [EXPORT]
export default router;
