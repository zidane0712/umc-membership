// [DEPENDENCIES]
import express, { Request, Response, NextFunction } from "express";

// [IMPORTS]
import {
  createMinistrySchema,
  updateMinistrySchema,
} from "../validators/ministryValidator";
import {
  getAllMinistry,
  createMinistry,
  getMinistryById,
  updateMinistry,
  deleteMinistry,
  addMemberToMinistry,
  removeMembersFromMinistry,
} from "../controllers/ministriesController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { validateLocalChurch } from "../middleware/validateLocalChurch";

const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(asyncHandler(getAllMinistry))
  .post(
    validate(createMinistrySchema),
    validateLocalChurch,
    asyncHandler(createMinistry)
  );

router
  .route("/:id")
  .get(asyncHandler(getMinistryById))
  .put(
    validate(updateMinistrySchema),
    validateLocalChurch,
    asyncHandler(updateMinistry)
  )
  .delete(asyncHandler(deleteMinistry));

router
  .route("/:id/members")
  .put(asyncHandler(addMemberToMinistry))
  .delete(asyncHandler(removeMembersFromMinistry));

router.use(errorHandler);

// [EXPORT]
export default router;
