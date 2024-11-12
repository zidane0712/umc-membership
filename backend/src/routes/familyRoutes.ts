// [IMPORT]
// Global import
import express, { Request, Response, NextFunction } from "express";
// Local import
import { authorize } from "../middleware/authorize";
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
  .get(authorize(["local"]), asyncHandler(getAllFamily))
  .post(
    authorize(["local"]),
    validate(createFamilySchema),
    validateLocalChurch,
    asyncHandler(createFamily)
  );

router
  .route("/:id")
  .get(authorize(["local"]), asyncHandler(getFamilyById))
  .put(
    authorize(["local"]),
    validate(updateFamilySchema),
    validateLocalChurch,
    asyncHandler(updateFamily)
  )
  .delete(authorize(["local"]), asyncHandler(deleteFamily));

router.use(errorHandler);

// [EXPORT]
export default router;
