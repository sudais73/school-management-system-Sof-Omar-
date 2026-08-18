import { findStudentByUserId, findClassSubjects } from "./student-portal.repository";
import { getStudentResult } from "@/modules/results/results.service";

export async function getMySubjects(userId: string) {
  const student = await findStudentByUserId(userId);
  if (!student?.classId) return [];
  const subjects = await findClassSubjects(student.classId);
  return subjects.map((s) => ({ id: s.id, name: s.name, teacherName: s.teacher?.user.fullName ?? null }));
}

export async function getMyResult(userId: string, session: string, term: string) {
  const student = await findStudentByUserId(userId);
  if (!student) throw new Error("Student profile not found");
  return getStudentResult(student.id, session, term);
}