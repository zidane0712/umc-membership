// [IMPORT]
// Global import
import express from "express";
// Local import
import { authorize } from "../middleware/authorize";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/userValidator";
import { loginUser, getAllUser } from "../controllers/userController";
import { errorHandler } from "../middleware/errorHandler";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validate";

const router = express.Router();

// [ROUTES]
// router.route("/").get(authorize(["admin"]),asyncHandler(getAllUser))
router.route("/login").post(asyncHandler(loginUser));

router.route("/").get(authorize(["admin"]), asyncHandler(getAllUser));

router.use(errorHandler);

// [EXPORT]
export default router;
