import prisma  from "@/config/prisma";
import { generateOtp } from "@/utils/otp.util";
import { findParentByEmail, createParentWithUser, linkParentToStudent, findParentByUserId } from "./parents.repository";

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