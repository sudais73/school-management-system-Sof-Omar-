import  prisma  from "@/config/prisma";
import type { AnnouncementCategory, AnnouncementAudience } from "@prisma/client";

export function createAnnouncement(data: {
  title: string; body: string; category: AnnouncementCategory; audience: AnnouncementAudience;
  classId?: string; pinned: boolean; authorId: string;
}) {
  return prisma.announcement.create({
    data,
    include: { author: { select: { id: true, fullName: true, role: true } }, class: { select: { className: true } } },
  });
}

export function findAllAnnouncements() {
  return prisma.announcement.findMany({
    include: { author: { select: { id: true, fullName: true, role: true } }, class: { select: { className: true } } },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });
}

// One shared query, driven by an OR list built differently per role in the service
export function findAnnouncementsWhere(orConditions: any[]) {
  return prisma.announcement.findMany({
    where: { OR: orConditions },
    include: { author: { select: { id: true, fullName: true, role: true } }, class: { select: { className: true } } },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });
}