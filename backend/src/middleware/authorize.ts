// [IMPORT]
// Global import
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
export const authorize =
  (allowedRoles: string[], validateEntityId: boolean = false) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        console.log("No token found");
        return res.status(401).json({ message: "Access token is required" });
      }

      // Verify the token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as DecodedToken;

      // Find the user based on the token's payload
      const user = await User.findById(decoded.id);
      if (!user) {
        console.log("User not found");
        return res.status(403).json({ message: "Access denied" });
      }

      // Check if the user's role is allowed
      if (!allowedRoles.includes(user.role)) {
        console.log("User role not allowed:", user.role);
        return res.status(403).json({ message: "Access denied" });
      }

      // Optional entity ID validation
      if (validateEntityId && req.params.id) {
        let entityId: string | undefined;

        // Determine the entity ID based on the user's role
        if (user.role === "local") entityId = user.localChurch?.toString();
        if (user.role === "district") entityId = user.district?.toString();
        if (user.role === "annual") entityId = user.annual?.toString();

        // Deny access if the entity ID does not match
        if (entityId && entityId !== req.params.id) {
          console.log(
            "Entity ID mismatch: expected",
            entityId,
            "but got",
            req.params.id
          );
          return res
            .status(403)
            .json({ message: "Access denied: Entity ID mismatch" });
        }
      }

      // Attach the user to the request object
      (req as AuthenticatedRequest).user = user;

      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      console.error("Token error:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
