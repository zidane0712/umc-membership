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
import { authorize } from "../middleware/authorize";

const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(authorize(["local"]), asyncHandler(getAllMinistry))
  .post(
    authorize(["local"]),
    validate(createMinistrySchema),
    validateLocalChurch,
    asyncHandler(createMinistry)
  );

router
  .route("/:id")
  .get(authorize(["local"]), asyncHandler(getMinistryById))
  .put(
    authorize(["local"]),
    validate(updateMinistrySchema),
    validateLocalChurch,
    asyncHandler(updateMinistry)
  )
  .delete(authorize(["local"]), asyncHandler(deleteMinistry));

router
  .route("/:id/members")
  .put(authorize(["local"]), asyncHandler(addMemberToMinistry))
  .delete(authorize(["local"]), asyncHandler(removeMembersFromMinistry));

router.use(errorHandler);

// [EXPORT]
export default router;
