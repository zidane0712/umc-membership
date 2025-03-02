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
  .get(
    authorize(["admin", "annual", "district", "local"]),
    asyncHandler(getAllMemberships)
  )
  .post(
    authorize(["local"]),
    validate(createMembershipSchema),
    validateLocalChurch,
    asyncHandler(createMembership)
  );

router
  .route("/:id")
  .get(authorize(["admin", "local"]), asyncHandler(getMemberById))
  .put(
    authorize(["local"]),
    validate(updateMembershipSchema),
    validateLocalChurch,
    asyncHandler(updateMember)
  )
  .delete(authorize(["local"]), asyncHandler(deleteMember));

router
  .route("/:id/ministry")
  .put(authorize(["local"]), asyncHandler(addMinistriesToMember))
  .delete(authorize(["local"]), asyncHandler(removeMinistriesFromMember));

router.use(errorHandler);

// [EXPORT]
export default router;
