import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * AuthRequest:
 * Extends the default Express Request type by allowing us to
 * attach a `userId` property after verifying the JWT.
 *
 * This lets controllers access `req.userId` safely.
 */
export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * authMiddleware:
 * -----------------------------------------------------
 * Protects routes by requiring a valid JWT token.
 *
 * How it works:
 * 1. Reads the Authorization header (format: "Bearer <token>")
 * 2. Extracts and verifies the token with JWT
 * 3. Decodes the token to get the user's ID
 * 4. Attaches the user ID to req.userId
 * 5. Calls next() to allow the request to proceed
 *
 * If:
 * - No token → return 401 Unauthorized
 * - Invalid token → return 401 Unauthorized
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  // Authorization header must exist (e.g., "Bearer ey123...")
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  // Extract the token part from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "secret";

    /**
     * Verify token:
     * - If invalid or expired → throws an error
     * - If valid → returns the decoded payload (e.g. { id, iat, exp })
     */
    const payload = jwt.verify(token, secret) as any;

    // Attach user ID to the request so controllers can access it
    req.userId = payload.id;

    // Allow request to continue to protected route/controller
    next();

  } catch (err) {
    // Token invalid or expired
    return res.status(401).json({ message: "Invalid token" });
  }
};
