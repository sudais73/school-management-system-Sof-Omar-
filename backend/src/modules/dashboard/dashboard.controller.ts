import type { Request, Response } from "express";
import { getAdminSummary } from "./dashboard.service";

export async function adminSummaryHandler(_req: Request, res: Response) {
  const summary = await getAdminSummary();
  res.status(200).json({ summary });
}