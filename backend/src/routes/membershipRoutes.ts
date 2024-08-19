// [DEPENDECIES]
import express, { Request, Response, NextFunction } from "express";
import Joi from "joi";

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

// [JOI MIDDLEWARE]

// [DECLARATION]
const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(asyncHandler(getAllMemberships))
  .post(
    validate(createMembershipSchema),
    validateAnnualConference,
    asyncHandler(createMembership)
  );

router
  .route("/:id")
  .get(asyncHandler(getMemberById))
  .put(
    validate(updateMembershipSchema),
    validateAnnualConference,
    asyncHandler(updateMember)
  )
  .delete(asyncHandler(deleteMember));

router.use(errorHandler);

// [EXPORT]
export default router;
