import type { Request, Response } from "express";
import prisma  from "@/config/prisma";
import { getClassResults } from "./results.service";

export async function getResultsHandler(req: Request, res: Response) {
  const { classId, session, term } = req.query;
  if (!classId || !session || !term) {
    return res.status(400).json({ message: "classId, session, and term are required" });
  }

  const cls = await prisma.class.findUnique({ where: { id: String(classId) }, select: { className: true } });
  if (!cls) return res.status(404).json({ message: "Class not found" });

  const result = await getClassResults(String(classId), String(session), String(term));

  if (!result) {
    return res.status(404).json({ message: `No results released for ${cls.className} — ${term} ${session}` });
  }

  res.status(200).json({ result: { ...result, className: cls.className } });
}