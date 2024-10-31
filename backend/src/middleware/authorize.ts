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
        return res.status(401).json({ message: "Access token is required" });
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await User.findById(decoded.userId);

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      (req as AuthenticatedRequest).user = user;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalide or expired token" });
    }
  };
