// [DEPENDENCIES]
import express, { Request, Response, NextFunction } from "express";

// [IMPORTS]
import {
  createCouncilSchema,
  updateCouncilSchema,
} from "../validators/councilValidator";
import {
  getAllCouncil,
  createCouncil,
  getCouncilById,
  updateCouncil,
  deleteCouncil,
} from "../controllers/councilController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { validateLocalChurch } from "../middleware/validateLocalChurch";
import { validateDistrictConference } from "../middleware/validateDistrictConference";
import { validateAnnualConference } from "../middleware/validateAnnualConference";

const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(asyncHandler(getAllCouncil))
  .post(
    validate(createCouncilSchema),
    validateAnnualConference,
    validateDistrictConference,
    validateLocalChurch,
    asyncHandler(createCouncil)
  );

router
  .route("/:id")
  .get(asyncHandler(getCouncilById))
  .put(
    validate(updateCouncilSchema),
    validateAnnualConference,
    validateDistrictConference,
    validateLocalChurch,
    asyncHandler(updateCouncil)
  )
  .delete(asyncHandler(deleteCouncil));

router.use(errorHandler);

// [EXPORT]
export default router;
