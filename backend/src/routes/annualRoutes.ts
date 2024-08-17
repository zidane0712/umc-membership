// [DEPENDENCIES]
import express, { Request, Response, NextFunction } from "express";
import Joi from "joi";

// [IMPORTS]
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

// [JOI MIDDLEWARE]
const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        errors: error.details.map(
          (err: Joi.ValidationErrorItem) => err.message
        ),
      });
    }
    next();
  };
};

// [DECLARATION]
const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(asyncHandler(getAllAnnual))
  .post(validate(createAnnualSchema), asyncHandler(createAnnual));

router
  .route("/:id")
  .get(asyncHandler(getAnnualById))
  .put(validate(updateAnnualSchema), asyncHandler(updateAnnual))
  .delete(asyncHandler(deleteAnnual));

router.use(errorHandler);

// [EXPORT]
export default router;
