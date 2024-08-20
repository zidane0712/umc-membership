// [DEPENDENCIES]
import express, { Request, Response, NextFunction } from "express";

// [IMPORTS]
import {
  createLocalChurchSchema,
  updateLocalChurchSchema,
} from "../validators/localChurchValidator";
import {
  getAllLocalChurch,
  createLocalChurch,
  getLocalChurchById,
  updateLocalChurch,
  deleteLocalChurch,
} from "../controllers/localChurchController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { validateDistrictConference } from "../middleware/validateDistrictConference";

const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(asyncHandler(getAllLocalChurch))
  .post(
    validate(createLocalChurchSchema),
    validateDistrictConference,
    asyncHandler(createLocalChurch)
  );

router
  .route("/:id")
  .get(asyncHandler(getLocalChurchById))
  .put(
    validate(updateLocalChurchSchema),
    validateDistrictConference,
    asyncHandler(updateLocalChurch)
  )
  .delete(asyncHandler(deleteLocalChurch));

router.use(errorHandler);

// [EXPORT]
export default router;
