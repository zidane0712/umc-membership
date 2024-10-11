// [IMPORT]
// Global import
import express, { Request, Response, NextFunction } from "express";
// Local import
import {
  createFamilySchema,
  updateFamilySchema,
} from "../validators/familyValidator";
import { getAllFamily, createFamily } from "../controllers/familyController";
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

router.use(errorHandler);

// [EXPORT]
export default router;
