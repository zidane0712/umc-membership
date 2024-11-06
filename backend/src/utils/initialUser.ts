// [IMPORT]
// Global
import bcrypt from "bcrypt";
// Local
import User from "../models/Users";
import { handleError } from "./handleError";

// [FUNCTION]
export const createInitialAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Initial admin already exists");
      return;
    }

    const adminDetails = {
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    };

    if (!adminDetails.password) {
      throw new Error("ADMIN_PASSWORD is not defined in the .env file.");
    }

    console.log("Plain text password from .env:", adminDetails.password);

    const adminUser = new User(adminDetails);
    await adminUser.save();
    console.log("Initial admin user created successfully.");
  } catch (err) {
    console.error("An error occurred while creating initial admin:", err);
  }
};
