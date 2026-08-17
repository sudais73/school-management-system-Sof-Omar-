import prisma  from "@/config/prisma";

export function findParentByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, include: { parent: true } });
}

export function createParentWithUser(data: { fullName: string; email: string; phone?: string; studentId: string; otp: string; otpExpiresAt: Date }) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { fullName: data.fullName, email: data.email, role: "PARENT", otp: data.otp, otpExpiresAt: data.otpExpiresAt },
    });
    const parent = await tx.parent.create({
      data: { userId: user.id, phone: data.phone, students: { connect: { id: data.studentId } } },
    });
    return { user, parent };
  });
}

export function linkParentToStudent(parentId: string, studentId: string) {
  return prisma.parent.update({ where: { id: parentId }, data: { students: { connect: { id: studentId } } } });
}

export function findParentByUserId(userId: string) {
  return prisma.parent.findUnique({
    where: { userId },
    include: {
      students: {
        select: { id: true, firstName: true, lastName: true, admissionNumber: true, gender: true, class: { select: { className: true } } },
      },
    },
  });
}

export function isStudentLinkedToParent(userId: string, studentId: string) {
  return prisma.parent.findFirst({ where: { userId, students: { some: { id: studentId } } } });
}