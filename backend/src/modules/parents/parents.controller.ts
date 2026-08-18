import type { Request, Response } from "express";
import { getMyChildren, getParentSummary, inviteParent } from "./parents.service";
import { getStudentResult } from "../results/results.service";
import { isStudentLinkedToParent } from "./parents.repository";

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

export async function getMyChildResultHandler(req: Request, res: Response) {
  const { studentId, session, term } = req.query;
  if (!studentId || !session || !term) return res.status(400).json({ message: "studentId, session, and term are required" });

  const linked = await isStudentLinkedToParent(req.user!.userId, String(studentId));
  if (!linked) return res.status(403).json({ message: "This student isn't linked to your account" });

  const result = await getStudentResult(String(studentId), String(session), String(term));
  if (!result) return res.status(404).json({ message: "No results released for this term yet" });

  res.status(200).json({ result });
}

export async function parentSummaryHandler(req: Request, res: Response) {
  try {
    const summary = await getParentSummary(req.user!.userId);
    res.status(200).json({ summary });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}