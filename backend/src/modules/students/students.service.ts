import { generateOtp } from "@/utils/otp.util";
import { generateAdmissionNumber } from "@/utils/admission-number.util";
import { generateStudentEmail } from "@/utils/student-email.util";
import { createStudentWithUser, findAllStudents } from "./students.repository";

type AddStudentInput = Omit<Parameters<typeof createStudentWithUser>[0], "email" | "otp" | "otpExpiresAt" | "admissionNumber">;

export async function addStudent(input: AddStudentInput) {
  const email = await generateStudentEmail(input.firstName, input.lastName);
  const { otp, expiresAt } = generateOtp();
  const admissionNumber = await generateAdmissionNumber();

  const { user, student } = await createStudentWithUser({ ...input, email, otp, otpExpiresAt: expiresAt, admissionNumber });
  return { user, student, otp, email };
}

export function getStudents() {
  return findAllStudents();
}