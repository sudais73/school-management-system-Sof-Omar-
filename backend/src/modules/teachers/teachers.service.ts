import { generateOtp } from "@/utils/otp.util";
import { generateStaffId } from "@/utils/staff-id.util";
import { createTeacherWithAssignments } from "./teachers.repository";

export async function addTeacher(input: Omit<Parameters<typeof createTeacherWithAssignments>[0], "otp" | "otpExpiresAt" | "employeeId">) {
  const { otp, expiresAt } = generateOtp();
  const employeeId = await generateStaffId();

  const { user, teacher } = await createTeacherWithAssignments({ ...input, otp, otpExpiresAt: expiresAt, employeeId });

  return { user, teacher, otp };
}