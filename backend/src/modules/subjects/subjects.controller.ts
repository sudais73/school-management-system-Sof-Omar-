import type { Request, Response } from "express";
import { getClassesWithSubjects, addSubject } from "./subjects.service";

export async function listClassesWithSubjects(_req: Request, res: Response) {
  const classes = await getClassesWithSubjects();
  res.status(200).json(classes);
}

export async function createSubjectHandler(req: Request, res: Response) {
  const { classId, name } = req.body;
  if (!classId || !name) {
    return res.status(400).json({ message: "classId and name are required" });
  }

  try {
    const subject = await addSubject(classId, name);
    res.status(201).json({ subject });
  } catch (err: any) {
    // Prisma throws P2002 when the @@unique([classId, name]) constraint is hit
    if (err.code === "P2002") {
      return res.status(409).json({ message: "This class already has a subject with that name" });
    }
    throw err;
  }
}