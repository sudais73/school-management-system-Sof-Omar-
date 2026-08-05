import type { Request, Response } from "express";
import { getClasses, addClass } from "./classes.service";

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