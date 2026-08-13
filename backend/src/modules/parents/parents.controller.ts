import type { Request, Response } from "express";
import { inviteParent } from "./parents.service";

export async function inviteParentHandler(req: Request, res: Response) {
  const { studentId, fullName, email, phone } = req.body;
  if (!studentId) return res.status(400).json({ message: "studentId is required" });

  try {
    const result = await inviteParent(studentId, { fullName, email, phone });
    res.status(201).json({ parent: result.parent, alreadyExisted: result.alreadyExisted, setupOtp: result.otp });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}