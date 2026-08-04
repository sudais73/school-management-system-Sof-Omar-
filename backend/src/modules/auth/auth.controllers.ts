import type { Request, Response } from "express";
import { loginUser } from "./auth.service";
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const result = await loginUser(email, password);
  if (!result.success) return res.status(401).json({ message: result.message });

  return res.status(200).json({
    token: result.token,
    role: result.role,
    mustChangePassword: result.mustChangePassword,
  });
}