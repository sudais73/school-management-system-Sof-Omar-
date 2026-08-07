import prisma from "@/config/prisma";
import type { Gender, EmploymentType, Designation } from "@prisma/client";

type CreateTeacherInput = {
    fullName: string;
    email: string;
    otp: string;
    otpExpiresAt: Date;
    employeeId: string;
    gender?: Gender;
    dateOfBirth?: Date;
    phone?: string;
    alternatePhone?: string;
    residentialAddress?: string;
    employmentDate?: Date;
    employmentType?: EmploymentType;
    department?: string;
    designation?: Designation;
    highestQualification?: string;
    specialization?: string;
    professionalCertification?: string;
    classId: string;
    subjectIds: string[];
    isHomeroomTeacher: boolean;
};

export function createTeacherWithAssignments(input: CreateTeacherInput) {
    return prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                fullName: input.fullName,
                email: input.email,
                role: "TEACHER",
                otp: input.otp,
                otpExpiresAt: input.otpExpiresAt,
            },
        });

        const teacher = await tx.teacher.create({
            data: {
                userId: user.id,
                employeeId: input.employeeId,
                gender: input.gender,
                dateOfBirth: input.dateOfBirth,
                phone: input.phone,
                alternatePhone: input.alternatePhone,
                residentialAddress: input.residentialAddress,
                employmentDate: input.employmentDate,
                employmentType: input.employmentType,
                department: input.department,
                designation: input.designation,
                highestQualification: input.highestQualification,
                specialization: input.specialization,
                professionalCertification: input.professionalCertification,
            },
        });

        // classId filter here is a safety check — even if the frontend sent a
        // subjectId that doesn't actually belong to the selected class, it's ignored
        if (input.subjectIds.length > 0) {
            await tx.subject.updateMany({
                where: { id: { in: input.subjectIds }, classId: input.classId },
                data: { teacherId: teacher.id },
            });
        }

        if (input.isHomeroomTeacher) {
            await tx.class.update({
                where: { id: input.classId },
                data: { homeroomTeacherId: teacher.id },
            });
        }

        return { user, teacher };
    });
}