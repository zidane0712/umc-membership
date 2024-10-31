// [IMPORT]
// Global
import bcrypt from "bcrypt";
// Local
import User from "../models/Users";
import { handleError } from "./handleError";

// [FUNCTION]
export const createInitialAdmin = async () => {
  try {
    // Checks if an admin user already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Initial admin already exists");
      return; // Exit if the admin exists
    }

    const adminDetails = {
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    };

    const hashedPassword = await bcrypt.hash(adminDetails.password!, 10);

    const adminUser = new User({
      ...adminDetails,
      password: hashedPassword,
    });

    await adminUser.save();
    console.log("Initial admin user created successfully.");
  } catch (err) {
    console.error("An error occurred while creating initial admin:", err);
  }
};
