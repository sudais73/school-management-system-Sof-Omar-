import prisma  from "@/config/prisma";

export function findPublishedStructures(classId: string, session: string, term: string) {
  return prisma.gradeStructure.findMany({
    where: { classId, session, term },
    include: {
      subject: { select: { id: true, name: true } },
      components: { where: { status: "PUBLISHED" }, orderBy: { order: "asc" } },
    },
  });
}

export function findClassStudents(classId: string) {
  return prisma.student.findMany({
    where: { classId },
    select: { id: true, firstName: true, middleName: true, lastName: true, admissionNumber: true, gender: true },
  });
}

export function findMarksForComponents(componentIds: string[]) {
  return prisma.studentMark.findMany({ where: { gradeComponentId: { in: componentIds } } });
}