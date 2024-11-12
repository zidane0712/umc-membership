// [DEPENDENCIES]
import express, { Request, Response, NextFunction } from "express";

// [IMPORTS]
import { authorize } from "../middleware/authorize";
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
  getAnniversariesByMonth,
} from "../controllers/localChurchController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { validateDistrictConference } from "../middleware/validateDistrictConference";
import { validateAnnualConference } from "../middleware/validateAnnualConference";

const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(authorize(["admin"]), asyncHandler(getAllLocalChurch))
  .post(
    authorize(["admin"]),
    validate(createLocalChurchSchema),
    validateDistrictConference,
    validateAnnualConference,
    asyncHandler(createLocalChurch)
  );

router
  .route("/anniversaries")
  .get(authorize(["admin"]), asyncHandler(getAnniversariesByMonth));

router
  .route("/:id")
  .get(authorize(["admin"]), asyncHandler(getLocalChurchById))
  .put(
    authorize(["admin"]),
    validate(updateLocalChurchSchema),
    validateDistrictConference,
    validateAnnualConference,
    asyncHandler(updateLocalChurch)
  )
  .delete(authorize(["admin"]), asyncHandler(deleteLocalChurch));

router.use(errorHandler);

// [EXPORT]
export default router;
