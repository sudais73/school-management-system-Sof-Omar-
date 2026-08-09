import type { Request, Response } from "express";
import { addFeeStructure, getStructuresForClass, getStudentFees } from "./fees.service";
import { recordPayment } from "./fees.repository";

export async function createFeeStructureHandler(req: Request, res: Response) {
  const { classId, session, term, name, dueDate, description, items } = req.body;

  if (!classId || !session || !term || !name || !dueDate || !items?.length) {
    return res.status(400).json({ message: "classId, session, term, name, dueDate, and items are required" });
  }

  const structure = await addFeeStructure({
    classId, session, term, name, description,
    dueDate: new Date(dueDate),
    items,
  });

  res.status(201).json({ structure });
}

export async function listStructuresHandler(req: Request, res: Response) {
  const { classId, session, term } = req.query;
  if (!classId || !session || !term) {
    return res.status(400).json({ message: "classId, session, and term query params are required" });
  }
  const structures = await getStructuresForClass(String(classId), String(session), String(term));
  res.status(200).json({ structures });
}

export async function listStudentFeesHandler(req: Request, res: Response) {
  const { structureId } = req.query;
  if (!structureId) return res.status(400).json({ message: "structureId query param is required" });
  const fees = await getStudentFees(String(structureId));
  res.status(200).json({ fees });
}

export async function recordPaymentHandler(req: Request, res: Response) {
  const { studentFeeId, amount, receiptNumber, note } = req.body;

  if (!studentFeeId || !amount) {
    return res.status(400).json({ message: "studentFeeId and amount are required" });
  }

  try {
    const result = await recordPayment({
      studentFeeId,
      amount: Number(amount),
      receiptNumber,
      note,
      recordedById: req.user!.userId, // set by requireAuth — the logged-in admin
    });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message ?? "Failed to record payment" });
  }
}