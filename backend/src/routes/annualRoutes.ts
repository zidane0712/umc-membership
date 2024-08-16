// [DEPENDENCIES]
import express from "express";

// [IMPORTS]
import {
  getAllAnnual,
  createAnnual,
  getAnnualById,
  updateAnnual,
  deleteAnnual,
} from "../controllers/annualController";

// [DECLARATION]
const router = express.Router();

// [ROUTES]
router.route("/").get(getAllAnnual).post(createAnnual);
router.route("/:id").get(getAnnualById).put(updateAnnual).delete(deleteAnnual);

// [EXPORT]
export default router;
