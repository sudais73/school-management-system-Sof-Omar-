import { generateOtp } from "@/utils/otp.util";
import { generateAdmissionNumber } from "@/utils/admission-number.util";
import { generateStudentEmail } from "@/utils/student-email.util";
import { createStudentWithUser, findAllStudents } from "./students.repository";
import { inviteParent } from "@/modules/parents/parents.service";

type AddStudentInput = Omit<Parameters<typeof createStudentWithUser>[0], "email" | "otp" | "otpExpiresAt" | "admissionNumber">;

export async function addStudent(input: AddStudentInput) {
  const email = await generateStudentEmail(input.firstName, input.lastName);
  const { otp, expiresAt } = generateOtp();
  const admissionNumber = await generateAdmissionNumber();

  const { user, student } = await createStudentWithUser({ ...input, email, otp, otpExpiresAt: expiresAt, admissionNumber });

  // Auto-invite the guardian as a real Parent account, using the same
  // guardianName/guardianEmail already captured on this form — no
  // separate admin action needed.
  let parentResult: { otp: string | null; alreadyExisted: boolean } | null = null;
  if (input.guardianEmail && input.guardianName) {
    try {
      const result = await inviteParent(student.id, {
        fullName: input.guardianName,
        email: input.guardianEmail,
        phone: input.guardianPhone,
      });
      parentResult = { otp: result.otp, alreadyExisted: result.alreadyExisted };
    } catch (err) {
      // Don't fail the whole student creation over a parent-invite hiccup
      // (e.g. that email already belongs to a non-parent account) — the
      // student record is still valid and admin can retry the invite later.
      parentResult = null;
    }
  }

  return { user, student, otp, email, parent: parentResult };
}

export function getStudents(search?: string) {
  return findAllStudents(search);
}