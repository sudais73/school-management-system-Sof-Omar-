import type { Request, Response } from "express";
import * as service from "./grades.service";
import prisma  from "@/config/prisma";

export async function myClassesHandler(req: Request, res: Response) {
  const teacher = await prisma.teacher.findUnique({ where: { userId: req.user!.userId } });
  if (!teacher) return res.status(404).json({ message: "Teacher profile not found" });
  const classes = await service.getTeacherClasses(teacher.id);
  res.status(200).json({ classes });
}

export async function getStructureHandler(req: Request, res: Response) {
  const { classId, subjectId, term, session } = req.query;
  const teacher = await prisma.teacher.findUnique({ where: { userId: req.user!.userId } });
  if (!teacher) return res.status(404).json({ message: "Teacher profile not found" });

  const structure = await service.getStructure(teacher.id, String(classId), String(subjectId), String(term), String(session));
  res.status(200).json({ structure });
}

export async function createStructureHandler(req: Request, res: Response) {
  const { classId, subjectId, title, term, session, components } = req.body;
  const teacher = await prisma.teacher.findUnique({ where: { userId: req.user!.userId } });
  if (!teacher) return res.status(404).json({ message: "Teacher profile not found" });

  try {
    const structure = await service.addStructure({ teacherId: teacher.id, classId, subjectId, title, term, session, components });
    res.status(201).json({ structure });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function listMarksHandler(req: Request, res: Response) {
  const { componentId } = req.query;
  const marks = await service.getStructure as any; // not used directly here
  const rows = await prisma.studentMark.findMany({ where: { gradeComponentId: String(componentId) } });
  res.status(200).json({ marks: rows });
}

export async function saveMarksHandler(req: Request, res: Response) {
  const { componentId, marks, action } = req.body;
  try {
    const result = await service.saveComponentMarks(componentId, marks, action);
    res.status(200).json({ component: result });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
export async function teacherSummaryHandler(req: Request, res: Response) {
  const teacher = await prisma.teacher.findUnique({ where: { userId: req.user!.userId } });
  if (!teacher) return res.status(404).json({ message: "Teacher profile not found" });
  const summary = await service.getTeacherSummary(teacher.id);
  res.status(200).json({ summary });
}