import prisma from "@/config/prisma";

export function findAllClasses() {
  return prisma.class.findMany({
    include: {
      students: { select: { id: true } },
      subjects: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function createClass(data: { className: string; capacity?: number }) {
  return prisma.class.create({ data });
}
export function updateClass(id: string, data: { className: string; capacity?: number }) {
  return prisma.class.update({ where: { id }, data });
}

export function findClassById(id: string) {
  return prisma.class.findUnique({
    where: { id },
    include: {
      subjects: {
        include: {
          teacher: {
            include: { user: { select: { id: true, fullName: true, email: true } } },
          },
        },
      },
      students: { select: { id: true } },
    },
  });
}