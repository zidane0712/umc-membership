// [DEPENDECIES]
import express, { Request, Response, NextFunction } from "express";

// [IMPORTS]
import {
  createMembershipSchema,
  updateMembershipSchema,
} from "../validators/membershipValidator";
import {
  getAllMemberships,
  createMembership,
  getMemberById,
  updateMember,
  deleteMember,
} from "../controllers/membershipController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validateAnnualConference } from "../middleware/validateAnnualConference";
import { validate } from "../middleware/validate";
import { validateDistrictConference } from "../middleware/validateDistrictConference";

// [DECLARATION]
const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(asyncHandler(getAllMemberships))
  .post(
    validate(createMembershipSchema),
    validateAnnualConference,
    validateDistrictConference,
    asyncHandler(createMembership)
  );

router
  .route("/:id")
  .get(asyncHandler(getMemberById))
  .put(
    validate(updateMembershipSchema),
    validateAnnualConference,
    validateDistrictConference,
    asyncHandler(updateMember)
  )
  .delete(asyncHandler(deleteMember));

router.use(errorHandler);

// [EXPORT]
export default router;
