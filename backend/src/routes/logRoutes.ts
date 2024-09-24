// [IMPORTS]
// Global import
import express, { Request, Response, NextFunction } from "express";
// Local import
import { getAllLogs } from "../controllers/logsController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";

const router = express.Router();

// [ROUTES]
router.route("/").get(asyncHandler(getAllLogs));

router.use(errorHandler);

// [EXPORT]
export default router;
