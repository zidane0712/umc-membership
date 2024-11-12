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
  .get(authorize(["admin"]), asyncHandler(getAllAnnual))
  .post(
    authorize(["admin"]),
    validate(createAnnualSchema),
    asyncHandler(createAnnual)
  );

router
  .route("/:id")
  .get(authorize(["admin"]), asyncHandler(getAnnualById))
  .put(
    authorize(["admin"]),
    validate(updateAnnualSchema),
    asyncHandler(updateAnnual)
  )
  .delete(authorize(["admin"]), asyncHandler(deleteAnnual));

router.use(errorHandler);

// [EXPORT]
export default router;
