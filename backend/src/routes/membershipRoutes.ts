// [DEPENDECIES]
import express from "express";
import {
  getMemberships,
  createMembership,
} from "../controllers/membershipController";

const router = express.Router();

router.get("/membership", getMemberships);
router.post("/membership", createMembership);

export default router;
