// [DEPENDECIES]
import express, { Request, Response, NextFunction } from "express";

// [IMPORTS]
import { authorize } from "../middleware/authorize";
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
  addMinistriesToMember,
  removeMinistriesFromMember,
} from "../controllers/membershipController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validateLocalChurch } from "../middleware/validateLocalChurch";
import { validate } from "../middleware/validate";

// [DECLARATION]
const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(asyncHandler(getAllMemberships))
  .post(
    validate(createMembershipSchema),
    validateLocalChurch,
    asyncHandler(createMembership)
  );

router
  .route("/:id")
  .get(asyncHandler(getMemberById))
  .put(
    validate(updateMembershipSchema),
    validateLocalChurch,
    asyncHandler(updateMember)
  )
  .delete(asyncHandler(deleteMember));

router
  .route("/:id/ministry")
  .put(asyncHandler(addMinistriesToMember))
  .delete(asyncHandler(removeMinistriesFromMember));

router.use(errorHandler);

// [EXPORT]
export default router;
