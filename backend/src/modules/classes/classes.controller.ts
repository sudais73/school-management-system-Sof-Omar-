import type { Request, Response } from "express";
import { getClasses, addClass, editClass } from "./classes.service";
import { findClassById } from "./classes.repository";

export async function listClasses(_req: Request, res: Response) {
  const classes = await getClasses();
  res.status(200).json({ classes });
}

export async function createClassHandler(req: Request, res: Response) {
  const { className, capacity } = req.body;

  if (!className) {
    return res.status(400).json({ message: "className is required" });
  }

  const newClass = await addClass(className, capacity);
  res.status(201).json({ class: newClass });
}

export async function updateClassHandler(req: Request, res: Response) {
  const { className, capacity } = req.body;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const updated = await editClass(id, className, capacity);
  res.status(200).json({ class: updated });
}

export async function findClassByIdHandler(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const classData = await findClassById(id);
  if (!classData) {
    return res.status(404).json({ message: "Class not found" });
  }
  res.status(200).json({ class: classData });
}