import  prisma  from "@/config/prisma";

export function findStudentByUserId(userId: string) {
  return prisma.student.findUnique({ where: { userId } });
}

export function findClassSubjects(classId: string) {
  return prisma.subject.findMany({
    where: { classId },
    include: { teacher: { include: { user: { select: { fullName: true } } } } },
  });
}