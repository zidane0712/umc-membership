// [IMPORT]
// Global import
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/Users";

// [INTERFACE]
interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// [FUNCTION]
export const authorize =
  (allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.log("No token found");
        return res.status(401).json({ message: "Access token is required" });
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const user = await User.findById(decoded.id);

      if (!user || !allowedRoles.includes(user.role)) {
        console.log("User role not allowed or user not found");
        return res.status(403).json({ message: "Access denied" });
      }

      (req as AuthenticatedRequest).user = user;
      next();
    } catch (err) {
      console.log("Token error:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
