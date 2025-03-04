// [IMPORT]
// Global import
import express, { Request, Response, NextFunction } from "express";
// Local import
import { authorize } from "../middleware/authorize";
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
  .get(authorize(["local"]), asyncHandler(getAllAttendance))
  .post(
    authorize(["local"]),
    validate(createAttendanceSchema),
    validateLocalChurch,
    asyncHandler(createAttendance)
  );

router
  .route("/:id")
  .get(authorize(["local"]), asyncHandler(getAttendanceById))
  .put(
    authorize(["local"]),
    validate(updateAttendanceSchema),
    validateLocalChurch,
    asyncHandler(updateAttendance)
  )
  .delete(authorize(["local"]), asyncHandler(deleteAttendance));

router.use(errorHandler);

// [EXPORT]
export default router;
