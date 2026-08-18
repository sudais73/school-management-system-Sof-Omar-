import prisma  from "@/config/prisma";
import { generateOtp } from "@/utils/otp.util";
import { findParentByEmail, createParentWithUser, linkParentToStudent, findParentByUserId, findParentChildrenWithClass } from "./parents.repository";
import { getStudentResult } from "@/modules/results/results.service";
import { SESSIONS, TERMS } from "@/config/academic.constants";
export async function inviteParent(studentId: string, overrides: { fullName?: string; email?: string; phone?: string }) {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) throw new Error("Student not found");

  const email = overrides.email ?? student.guardianEmail;
  const fullName = overrides.fullName ?? student.guardianName;
  const phone = overrides.phone ?? student.guardianPhone ?? undefined;

  if (!email || !fullName) throw new Error("Guardian name and email are required to invite a parent account");

  const existing = await findParentByEmail(email);
  if (existing) {
    if (existing.role !== "PARENT" || !existing.parent) {
      throw new Error("This email is already used by a non-parent account");
    }
    const parent = await linkParentToStudent(existing.parent.id, studentId);
    return { parent, alreadyExisted: true, otp: null as string | null };
  }

  const { otp, expiresAt } = generateOtp();
  const { parent } = await createParentWithUser({ fullName, email, phone, studentId, otp, otpExpiresAt: expiresAt });
  return { parent, alreadyExisted: false, otp };
}

export async function getMyChildren(userId: string) {
  const parent = await findParentByUserId(userId);
  if (!parent) throw new Error("Parent profile not found");
  return parent.students;
}

export async function getParentSummary(userId: string) {
  const parent = await findParentChildrenWithClass(userId);
  if (!parent) throw new Error("Parent profile not found");

  const children = await Promise.all(
    parent.students.map(async (student) => {
      const records = await prisma.attendanceRecord.findMany({ where: { studentId: student.id }, select: { status: true } });
      const present = records.filter((r) => r.status === "PRESENT").length;
      const attendancePercentage = records.length ? Math.round((present / records.length) * 100) : null;

      const result = await getStudentResult(student.id, SESSIONS[0], TERMS[0]).catch(() => null);

      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        className: student.class?.className ?? null,
        attendancePercentage,
        overallGrade: result?.summary.overallGrade ?? null,
        avgScore: result?.summary.avgScore ?? null,
      };
    })
  );

  return { children };
}