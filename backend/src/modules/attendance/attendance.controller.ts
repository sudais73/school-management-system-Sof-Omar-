import type { Request, Response } from "express";
import { getSession, saveSession } from "./attendance.service";
import  prisma from "@/config/prisma";

export async function getAttendanceHandler(req: Request, res: Response) {
  const { classId, date } = req.query;
  if (!classId || !date) return res.status(400).json({ message: "classId and date are required" });

  const result = await getSession(String(classId), String(date));
  res.status(200).json({ statusMap: result.statusMap, isEdit: result.isEdit });
}

export async function saveAttendanceHandler(req: Request, res: Response) {
  const { classId, date, records } = req.body;
  if (!classId || !date || !records?.length) {
    return res.status(400).json({ message: "classId, date, and records are required" });
  }

  const teacher = await prisma.teacher.findUnique({ where: { userId: req.user!.userId } });
  if (!teacher) return res.status(404).json({ message: "Teacher profile not found" });

  try {
    const result = await saveSession(classId, teacher.id, date, records);
    res.status(200).json({ isEdit: result.isEdit });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}