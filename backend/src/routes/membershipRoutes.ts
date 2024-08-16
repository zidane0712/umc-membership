// [DEPENDECIES]
import express from "express";

// [IMPORTS]
import {
  getAllMemberships,
  createMembership,
} from "../controllers/membershipController";

// [DECLARATION]
const router = express.Router();

// [ROUTES]
router.route("/").get(getAllMemberships).post(createMembership);

// [EXPORT]
export default router;
