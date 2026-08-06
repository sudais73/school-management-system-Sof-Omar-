import prisma  from "@/config/prisma";

export function findClassesWithSubjects() {
  return prisma.class.findMany({
    include: {
      subjects: {
        include: {
          teacher: { include: { user: { select: { id: true, fullName: true } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function createSubject(classId: string, name: string) {
  return prisma.subject.create({ data: { classId, name } });
}