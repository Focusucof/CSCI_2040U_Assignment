import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "test_secret_key";

export interface AuthRequest extends Request {
  user?: { userId: string; username: string; isAdmin: boolean };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
      isAdmin: boolean;
    };

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      isAdmin: decoded.isAdmin || false,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
