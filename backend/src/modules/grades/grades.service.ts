import * as repo from "./grades.repository";
import prisma  from "@/config/prisma";

export function getTeacherClasses(teacherId: string) {
  return repo.findTeacherClasses(teacherId);
}

export function getStructure(teacherId: string, classId: string, subjectId: string, term: string, session: string) {
  return repo.findStructure(teacherId, classId, subjectId, term, session);
}

export function addStructure(input: Parameters<typeof repo.createStructure>[0]) {
  const total = input.components.reduce((sum, c) => sum + c.maxScore, 0);
  if (total !== 100) throw new Error(`Component max scores must sum to 100 (currently ${total})`);
  return repo.createStructure(input);
}

export async function saveComponentMarks(gradeComponentId: string, marks: { studentId: string; score: number }[], action: "draft" | "release") {
  const component = await repo.findComponent(gradeComponentId);
  if (!component) throw new Error("Component not found");

  await repo.saveMarks(gradeComponentId, marks);

  if (action === "release") {
    const classStudentCount = await prisma.student.count({ where: { classId: component.gradeStructure.classId } });
    const filledCount = await prisma.studentMark.count({ where: { gradeComponentId } });

    if (filledCount < classStudentCount) {
      throw new Error(`Cannot release — ${classStudentCount - filledCount} student(s) still missing a score`);
    }
    return repo.publishComponent(gradeComponentId);
  }

  return component;
}

export async function getTeacherSummary(teacherId: string) {
  const { classes, homeroomClass } = await repo.getTeacherSummaryData(teacherId);

  const uniqueStudentIds = new Set(classes.flatMap((c) => c.students.map((s) => s.id)));
  const totalSubjects = classes.reduce((sum, c) => sum + c.subjects.length, 0);

  let homeroomAttendanceSubmittedToday = null;
  if (homeroomClass) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const session = await prisma.attendance.findUnique({ where: { classId_date: { classId: homeroomClass.id, date: today } } });
    homeroomAttendanceSubmittedToday = !!session;
  }

  return {
    totalClasses: classes.length,
    totalStudents: uniqueStudentIds.size,
    totalSubjects,
    homeroomClass: homeroomClass ? { id: homeroomClass.id, className: homeroomClass.className, studentCount: homeroomClass.students.length } : null,
    homeroomAttendanceSubmittedToday,
  };
}