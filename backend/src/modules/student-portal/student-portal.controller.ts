import type { Request, Response } from "express";
import { getMySubjects, getMyResult } from "./student-portal.service";

export async function mySubjectsHandler(req: Request, res: Response) {
  const subjects = await getMySubjects(req.user!.userId);
  res.status(200).json({ subjects });
}

export async function myResultHandler(req: Request, res: Response) {
  const { session, term } = req.query;
  if (!session || !term) return res.status(400).json({ message: "session and term are required" });

  const result = await getMyResult(req.user!.userId, String(session), String(term));
  if (!result) return res.status(404).json({ message: "No results released for this term yet" });

  res.status(200).json({ result });
}