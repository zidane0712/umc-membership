// [DEPENDECIES]
import express from "express";

// [IMPORTS]
import {
  getMemberships,
  createMembership,
} from "../controllers/membershipController";

// [DECLARATION]
const router = express.Router();

// [ROUTES]
// Route to get all membership and post membership
router.route("/").get(getMemberships).post(createMembership);

// [EXPORT]
export default router;
