// [DEPENDENCIES]
import express, { Request, Response, NextFunction } from "express";

// [IMPORTS]
import {
  createDistrictSchema,
  updateDistrictSchema,
} from "../validators/districtValidator";
import {
  getAllDistrict,
  createDistrict,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
} from "../controllers/districtController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validateAnnualConference } from "../middleware/validateAnnualConference";
import { validate } from "../middleware/validate";

const router = express.Router();

// [ROUTES]
router
  .route("/")
  .get(asyncHandler(getAllDistrict))
  .post(
    validate(createDistrictSchema),
    validateAnnualConference,
    asyncHandler(createDistrict)
  );

router
  .route("/:id")
  .get(asyncHandler(getDistrictById))
  .put(
    validate(updateDistrictSchema),
    validateAnnualConference,
    asyncHandler(updateDistrict)
  )
  .delete(asyncHandler(deleteDistrict));

router.use(errorHandler);

// [EXPORT]
export default router;
