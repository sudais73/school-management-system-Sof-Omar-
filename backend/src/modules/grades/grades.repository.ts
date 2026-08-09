import prisma  from "@/config/prisma";

export function findTeacherClasses(teacherId: string) {
  // Every class this teacher has at least one subject assigned in
  return prisma.class.findMany({
    where: { subjects: { some: { teacherId } } },
    include: {
      students: { select: { id: true, firstName: true, middleName: true, lastName: true, admissionNumber: true, gender: true } },
      subjects: { where: { teacherId }, select: { id: true, name: true } },
    },
  });
}

export function findStructure(teacherId: string, classId: string, subjectId: string, term: string, session: string) {
  return prisma.gradeStructure.findUnique({
    where: { teacherId_classId_subjectId_term_session: { teacherId, classId, subjectId, term, session } },
    include: { components: { orderBy: { order: "asc" } } },
  });
}

export function createStructure(data: {
  teacherId: string; classId: string; subjectId: string; title: string; term: string; session: string;
  components: { name: string; maxScore: number }[];
}) {
  return prisma.gradeStructure.create({
    data: {
      teacherId: data.teacherId, classId: data.classId, subjectId: data.subjectId,
      title: data.title, term: data.term, session: data.session,
      components: { create: data.components.map((c, i) => ({ ...c, order: i })) },
    },
    include: { components: true },
  });
}

export function findMarksForComponent(gradeComponentId: string) {
  return prisma.studentMark.findMany({ where: { gradeComponentId } });
}

export function findComponent(id: string) {
  return prisma.gradeComponent.findUnique({ where: { id }, include: { gradeStructure: true } });
}

export async function saveMarks(gradeComponentId: string, marks: { studentId: string; score: number }[]) {
  // One upsert per student — safe to call repeatedly, matches @@unique above
  await prisma.$transaction(
    marks.map((m) =>
      prisma.studentMark.upsert({
        where: { gradeComponentId_studentId: { gradeComponentId, studentId: m.studentId } },
        create: { gradeComponentId, studentId: m.studentId, score: m.score },
        update: { score: m.score },
      })
    )
  );
}

export function publishComponent(id: string) {
  return prisma.gradeComponent.update({ where: { id }, data: { status: "PUBLISHED", publishedAt: new Date() } });
}