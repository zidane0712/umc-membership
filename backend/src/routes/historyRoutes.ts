// [IMPORT]
// Global import
import express, { Request, Response, NextFunction } from "express";
// Local import
import { authorize } from "../middleware/authorize";
import {
  createHistorySchema,
  updateHistorySchema,
} from "../validators/historyValidator";
import {
  getAllHistory,
  createHistory,
  getHistoryById,
  updateHistory,
  deleteHistory,
} from "../controllers/historyController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { validateLocalChurch } from "../middleware/validateLocalChurch";

const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(authorize(["local"]), asyncHandler(getAllHistory))
  .post(
    authorize(["local"]),
    validate(createHistorySchema),
    validateLocalChurch,
    asyncHandler(createHistory)
  );

router
  .route("/:id")
  .get(authorize(["local"]), asyncHandler(getHistoryById))
  .put(
    authorize(["local"]),
    validate(updateHistorySchema),
    validateLocalChurch,
    asyncHandler(updateHistory)
  )
  .delete(authorize(["local"]), asyncHandler(deleteHistory));

router.use(errorHandler);

// [EXPORT]
export default router;
