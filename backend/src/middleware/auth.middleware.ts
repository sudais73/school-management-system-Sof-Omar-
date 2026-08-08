import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt.util";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId, role: payload.role as any };
    next(); // token is valid — let the real route handler run
  } catch {
    // verifyToken throws if the signature is invalid OR if it's expired —
    // either way, the frontend's interceptor will catch this 401 and
    // attempt a silent refresh automatically (built earlier).
    return res.status(401).json({ message: "Session expired or invalid" });
  }
}