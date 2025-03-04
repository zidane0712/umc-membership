// [DEPENDENCIES]
import express, { Request, Response, NextFunction } from "express";

// [IMPORTS]
import { authorize } from "../middleware/authorize";
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
  .get(
    authorize(["admin", "annual", "district", "local"]),
    asyncHandler(getAllDistrict)
  )
  .post(
    authorize(["admin"]),
    validate(createDistrictSchema),
    validateAnnualConference,
    asyncHandler(createDistrict)
  );

// Route for annual

router
  .route("/:id")
  .get(
    authorize(["admin", "annual", "district", "local"]),
    asyncHandler(getDistrictById)
  )
  .put(
    authorize(["admin"]),
    validate(updateDistrictSchema),
    validateAnnualConference,
    asyncHandler(updateDistrict)
  )
  .delete(authorize(["admin"]), asyncHandler(deleteDistrict));

router.use(errorHandler);

// [EXPORT]
export default router;
