// [IMPORTS]
// Global import
import express, { Request, Response, NextFunction } from "express";
// Local import
import { authorize } from "../middleware/authorize";
import { getAllLogs } from "../controllers/logsController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";

const router = express.Router();

// [ROUTES]
router.route("/").get(authorize(["admin"]), asyncHandler(getAllLogs));

router.use(errorHandler);

// [EXPORT]
export default router;
