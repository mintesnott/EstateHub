import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { UnauthenticatedError, ForbiddenError } from "../errors/index.js";
import prisma from "../config/database.js";

//ensures the request contains a valid JWT in the Authorization header.
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication token missing or malformed");
  }

  // Extract token string
  const token = authHeader.split(" ")[1];

  try {
    // Verify token signature and expiration
    const payload = verifyToken(token);

      // check that the user still exists
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        role: true,
        email: true,
        sessionVersion: true,
      },
    });

    if (!user) {
      throw new UnauthenticatedError("User not found");
    }

    // Check whether this JWT belongs to the current session version.
    if (user.sessionVersion !== payload.sessionVersion) {
      throw new UnauthenticatedError(
        "Session has expired. Please login again."
      );
    }

    // Attach decoded payload to req.user
    req.user = payload;
    next();
  } catch (_error) {
    throw new UnauthenticatedError("Invalid or expired token");
  }
};



// Restricts access to specific user roles  
export const authorize = (...allowedRoles: Array<"ADMIN" | "AGENT" | "CLIENT">) => {
  return (
    req: Request, 
    _res: Response, 
    next: NextFunction) => 
      {
          if (!req.user) {
            throw new UnauthenticatedError("User not authenticated");
          }

          if (!allowedRoles.includes(req.user.role)) {
            throw new ForbiddenError(`Access forbidden`);
          }

          next();
  };
};