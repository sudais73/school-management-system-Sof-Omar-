import type { Request, Response } from "express";
import { loginUser, setupAccount } from "./auth.service";
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const result = await loginUser(email, password);
if (!result.success) {
  return res.status(401).json({ message: result.message, requiresSetup: result.requiresSetup ?? false });
}

  return res.status(200).json({
    token: result.token,
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