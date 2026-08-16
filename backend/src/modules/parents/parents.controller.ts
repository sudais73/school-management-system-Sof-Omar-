import type { Request, Response } from "express";
import { getMyChildren, inviteParent } from "./parents.service";

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
export async function myChildrenHandler(req: Request, res: Response) {
  try {
    const students = await getMyChildren(req.user!.userId);
    res.status(200).json({ students });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}