import prisma  from "@/config/prisma";
import type { Gender, StudentStatus } from "@prisma/client";

type CreateStudentInput = {
  email: string;
  otp: string;
  otpExpiresAt: Date;
  admissionNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: Gender;
  dateOfBirth?: Date;
  residentialAddress?: string;
  stateOfOrigin?: string;
  nationality?: string;
  classId?: string;
  admissionDate?: Date;
  previousSchool?: string;
  status?: StudentStatus;
  guardianName?: string;
  guardianRelationship?: string;
  guardianPhone?: string;
  guardianOccupation?: string;
  guardianEmail?: string;
  guardianAddress?: string;
};

export function createStudentWithUser(input: CreateStudentInput) {
  return prisma.$transaction(async (tx) => {
    const fullName = [input.firstName, input.middleName, input.lastName].filter(Boolean).join(" ");

    const user = await tx.user.create({
      data: {
        fullName,
        email: input.email,
        role: "STUDENT",
        otp: input.otp,
        otpExpiresAt: input.otpExpiresAt,
      },
    });

    const student = await tx.student.create({
      data: {
        userId: user.id,
        admissionNumber: input.admissionNumber,
        firstName: input.firstName,
        middleName: input.middleName,
        lastName: input.lastName,
        gender: input.gender,
        dateOfBirth: input.dateOfBirth,
        residentialAddress: input.residentialAddress,
        stateOfOrigin: input.stateOfOrigin,
        nationality: input.nationality,
        classId: input.classId,
        admissionDate: input.admissionDate,
        previousSchool: input.previousSchool,
        status: input.status,
        guardianName: input.guardianName,
        guardianRelationship: input.guardianRelationship,
        guardianPhone: input.guardianPhone,
        guardianOccupation: input.guardianOccupation,
        guardianEmail: input.guardianEmail,
        guardianAddress: input.guardianAddress,
      },
    });

    return { user, student };
  });
}

export function findAllStudents() {
  return prisma.student.findMany({
    include: {
      user: { select: { id: true, email: true } },
      class: { select: { id: true, className: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}