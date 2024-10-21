// [IMPORT]
// Global import
import express, { Request, Response, NextFunction } from "express";
// Local import
import {
  createFamilySchema,
  updateFamilySchema,
} from "../validators/familyValidator";
import {
  getAllFamily,
  createFamily,
  getFamilyById,
  updateFamily,
  deleteFamily,
} from "../controllers/familyController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { validateLocalChurch } from "../middleware/validateLocalChurch";

const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(asyncHandler(getAllFamily))
  .post(
    validate(createFamilySchema),
    validateLocalChurch,
    asyncHandler(createFamily)
  );

router
  .route("/:id")
  .get(asyncHandler(getFamilyById))
  .put(
    validate(updateFamilySchema),
    validateLocalChurch,
    asyncHandler(updateFamily)
  )
  .delete(asyncHandler(deleteFamily));

router.use(errorHandler);

// [EXPORT]
export default router;
