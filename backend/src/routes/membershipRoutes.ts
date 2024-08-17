// [DEPENDECIES]
import express, { Request, Response, NextFunction } from "express";
import Joi from "joi";

// [IMPORTS]
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
} from "../controllers/membershipController";
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
  .get(asyncHandler(getAllMemberships))
  .post(validate(createMembershipSchema), asyncHandler(createMembership));

router
  .route("/:id")
  .get(asyncHandler(getMemberById))
  .put(validate(updateMembershipSchema), asyncHandler(updateMember))
  .delete(asyncHandler(deleteMember));

router.use(errorHandler);

// [EXPORT]
export default router;
