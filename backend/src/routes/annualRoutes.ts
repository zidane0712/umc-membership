// [DEPENDENCIES]
import express, { Request, Response, NextFunction } from "express";
import Joi from "joi";

// [IMPORTS]
import { authorize } from "../middleware/authorize";
import {
  createAnnualSchema,
  updateAnnualSchema,
} from "../validators/annualValidator";
import {
  getAllAnnual,
  createAnnual,
  getAnnualById,
  updateAnnual,
  deleteAnnual,
} from "../controllers/annualController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validate";

// [DECLARATION]
const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(authorize(["admin"], true), asyncHandler(getAllAnnual))
  .post(
    authorize(["admin"], true),
    validate(createAnnualSchema),
    asyncHandler(createAnnual)
  );

router
  .route("/:id")
  .get(authorize(["admin"], true), asyncHandler(getAnnualById))
  .put(
    authorize(["admin"], true),
    validate(updateAnnualSchema),
    asyncHandler(updateAnnual)
  )
  .delete(authorize(["admin"]), asyncHandler(deleteAnnual));

router.use(errorHandler);

// [EXPORT]
export default router;
