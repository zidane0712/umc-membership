// [DEPENDENCIES]
import express, { Request, Response, NextFunction } from "express";

// [IMPORTS]
import { authorize } from "../middleware/authorize";
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
  .get(authorize(["local"]), asyncHandler(getAllCouncil))
  .post(
    authorize(["local"]),
    validate(createCouncilSchema),
    validateAnnualConference,
    validateDistrictConference,
    validateLocalChurch,
    asyncHandler(createCouncil)
  );

router
  .route("/:id")
  .get(authorize(["local"]), asyncHandler(getCouncilById))
  .put(
    authorize(["local"]),
    validate(updateCouncilSchema),
    validateAnnualConference,
    validateDistrictConference,
    validateLocalChurch,
    asyncHandler(updateCouncil)
  )
  .delete(authorize(["local"]), asyncHandler(deleteCouncil));

router.use(errorHandler);

// [EXPORT]
export default router;
