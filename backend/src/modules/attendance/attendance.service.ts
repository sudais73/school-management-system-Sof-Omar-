import { findSession, upsertSession } from "./attendance.repository";

function normalizeDate(dateStr: string): Date {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isWithinEditableWindow(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
}

export async function getSession(classId: string, dateStr: string) {
  const date = normalizeDate(dateStr);
  const session = await findSession(classId, date);

  const statusMap: Record<string, string> = {};
  session?.records.forEach((r) => { statusMap[r.studentId] = r.status; });

  return { statusMap, isEdit: !!session };
}

export async function saveSession(classId: string, teacherId: string, dateStr: string, records: { studentId: string; status: string }[]) {
  const date = normalizeDate(dateStr);
  if (!isWithinEditableWindow(date)) {
    throw new Error("Attendance older than 7 days cannot be edited");
  }
  const existing = await findSession(classId, date);
  const session = await upsertSession(classId, teacherId, date, records);
  return { session, isEdit: !!existing };
}