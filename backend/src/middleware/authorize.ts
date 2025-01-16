// [IMPORT]
// Global import
import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/Users";

// [INTERFACE]
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

// [FUNCTION]
// [AUTHORIZATION MIDDLEWARE]
export const authorize =
  (allowedRoles: string[], validateEntityId: boolean = false) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract token
      if (!token)
        return res.status(401).json({ message: "Access token is required" });

      // Decode the token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;

      // Convert the decoded `id` to ObjectId
      const userId = new Types.ObjectId(decoded.id);

      // Find the user based on the decoded ID
      const user = await User.findById(userId);
      if (!user) return res.status(403).json({ message: "User not found" });

      // Ensure role validation
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Attach the user object to req.user
      (req as AuthenticatedRequest).user = user;
      next();
    } catch (err) {
      console.error("Token error:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
