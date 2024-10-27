// [IMPORT]
// Global import
import express, { Request, Response, NextFunction } from "express";
// Local import
import {
  createAttendanceSchema,
  updateAttendanceSchema,
} from "../validators/attendanceValidator";
import {
  getAllAttendance,
  createAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendanceController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { validateLocalChurch } from "../middleware/validateLocalChurch";

const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(asyncHandler(getAllAttendance))
  .post(
    validate(createAttendanceSchema),
    validateLocalChurch,
    asyncHandler(createAttendance)
  );

router
  .route("/:id")
  .get(asyncHandler(getAttendanceById))
  .put(
    validate(updateAttendanceSchema),
    validateLocalChurch,
    asyncHandler(updateAttendance)
  )
  .delete(asyncHandler(deleteAttendance));

router.use(errorHandler);

// [EXPORT]
export default router;
