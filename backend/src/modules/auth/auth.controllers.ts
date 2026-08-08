import type { Request, Response } from "express";
import { loginUser, logoutUser, refreshSession, setupAccount } from "./auth.service";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/api/auth", // cookie only sent to auth endpoints, not every request
};
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
 
  const result = await loginUser(email, password);
  if (!result.success) {
    return res.status(401).json({ message: result.message, requiresSetup: result.requiresSetup ?? false });
  }

  res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
  res.status(200).json({ token: result.accessToken, role: result.role, mustChangePassword: result.mustChangePassword });


  return res.status(200).json({
    token: result.accessToken,
    role: result.role,
    mustChangePassword: result.mustChangePassword,
  });
}

export async function setupAccountHandler(req: Request, res: Response) {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "email, otp, and newPassword are required" });
  }

  const result = await setupAccount(email, otp, newPassword);
  if (!result.success) return res.status(400).json({ message: result.message });

  res.status(200).json({ message: "Account set up successfully. You can now log in." });
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Not authenticated" });

  const result = await refreshSession(refreshToken);
  if (!result.success) {
    res.clearCookie("refreshToken", { path: "/api/auth" });
    return res.status(401).json({ message: result.message });
  }

  res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
  res.status(200).json({ token: result.accessToken, role: result.role });
}

export async function logout(req: Request, res: Response) {
  await logoutUser(req.cookies?.refreshToken);
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.status(200).json({ message: "Logged out" });
}