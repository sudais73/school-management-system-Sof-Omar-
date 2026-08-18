import type { Request, Response } from "express";
import { addAnnouncement, getAllAnnouncements, getAnnouncementsForUser } from "./announcements.service";

export async function createAnnouncementHandler(req: Request, res: Response) {
  const { title, body, category, audience, classId, pinned } = req.body;
  if (!title || !body) return res.status(400).json({ message: "Title and body are required" });

  const announcement = await addAnnouncement({
    title, body, category: category ?? "GENERAL", audience: audience ?? "ALL",
    classId: audience === "STUDENTS" || audience === "PARENTS" ? classId : undefined,
    pinned: !!pinned, authorId: req.user!.userId,
  });
  res.status(201).json({ announcement });
}

export async function listAnnouncementsHandler(req: Request, res: Response) {
  const isAdmin = req.user!.role === "SUPER_ADMIN" || req.user!.role === "ADMIN";
  const announcements = isAdmin
    ? await getAllAnnouncements()
    : await getAnnouncementsForUser(req.user!.userId, req.user!.role);
  res.status(200).json({ announcements });
}