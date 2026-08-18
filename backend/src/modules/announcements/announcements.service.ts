import  prisma  from "@/config/prisma";
import * as repo from "./announcements.repository";

export function addAnnouncement(input: Parameters<typeof repo.createAnnouncement>[0]) {
  return repo.createAnnouncement(input);
}

export function getAllAnnouncements() {
  return repo.findAllAnnouncements();
}

export async function getAnnouncementsForUser(userId: string, role: string) {
  // ALL always shows, regardless of role — the common case
  const orConditions: any[] = [{ audience: "ALL" }];

  if (role === "TEACHER") {
    orConditions.push({ audience: "TEACHERS" });
  }

  if (role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId } });
    orConditions.push({ audience: "STUDENTS", classId: null }); // announcements for all students
    if (student?.classId) {
      orConditions.push({ audience: "STUDENTS", classId: student.classId }); // announcements for their specific class
    }
  }

  if (role === "PARENT") {
    const parent = await prisma.parent.findUnique({ where: { userId }, include: { students: true } });
    orConditions.push({ audience: "PARENTS", classId: null });
    const classIds = [...new Set((parent?.students ?? []).map((s) => s.classId).filter(Boolean))];
    classIds.forEach((classId) => orConditions.push({ audience: "PARENTS", classId }));
  }

  return repo.findAnnouncementsWhere(orConditions);
}