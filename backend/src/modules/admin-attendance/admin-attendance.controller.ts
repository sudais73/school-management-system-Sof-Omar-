import type { Request, Response } from "express";
import * as service from "./admin-attendance.service";

export async function dailyOverviewHandler(req: Request, res: Response) {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "date is required" });
  const result = await service.getDailyOverview(String(date));
  res.status(200).json(result);
}

export async function classDetailHandler(req: Request, res: Response) {
  const { classId, date } = req.query;
  if (!classId || !date) return res.status(400).json({ message: "classId and date are required" });
  const result = await service.getClassAttendanceDetail(String(classId), String(date));
  res.status(200).json(result);
}

export async function studentHistoryHandler(req: Request, res: Response) {
  const { studentId } = req.query;
  if (!studentId) return res.status(400).json({ message: "studentId is required" });
  const result = await service.getStudentAttendanceHistory(String(studentId));
  res.status(200).json(result);
}