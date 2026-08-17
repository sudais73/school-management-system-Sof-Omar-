import { findPublishedStructures, findClassStudents, findMarksForComponents } from "./results.repository";
import { gradeFor, remarkFor } from "@/utils/grade.util";
import { findAttendanceStats } from "./results.repository";
import prisma from "@/config/prisma";

export async function getClassResults(classId: string, session: string, term: string) {
  const structures = findPublishedStructures ? await findPublishedStructures(classId, session, term) : [];
  const withScores = structures.filter((s) => s.components.length > 0);

  if (withScores.length === 0) {
    return null; // "no results released yet" — controller turns this into the right response
  }

  const students = await findClassStudents(classId);
  const componentIds = withScores.flatMap((s) => s.components.map((c) => c.id));
  const marks = await findMarksForComponents(componentIds);

  // studentId -> componentId -> score, built once instead of filtering the marks array per student
  const markMap = new Map<string, Map<string, number>>();
  marks.forEach((m) => {
    if (!markMap.has(m.studentId)) markMap.set(m.studentId, new Map());
    markMap.get(m.studentId)!.set(m.gradeComponentId, m.score);
  });

  const results = students.map((student) => {
    const studentMarks = markMap.get(student.id);

    const subjects = withScores.map((structure) => {
      const components = structure.components.map((c) => ({
        name: c.name,
        maxScore: c.maxScore,
        score: studentMarks?.get(c.id) ?? null,
      }));

      const grandMax = components.reduce((sum, c) => sum + c.maxScore, 0);
      const allScored = components.every((c) => c.score !== null);
      const total = components.reduce((sum, c) => sum + (c.score ?? 0), 0);

      const grade = allScored ? gradeFor(total, grandMax) : "—";

      return {
        subjectName: structure.subject.name,
        components,
        total,
        grandMax,
        grade,
        remark: allScored ? remarkFor(grade) : "Not yet scored",
      };
    });

    const scoredSubjects = subjects.filter((s) => s.grade !== "—");
    const avgScore = scoredSubjects.length
      ? Math.round(scoredSubjects.reduce((sum, s) => sum + (s.total / s.grandMax) * 100, 0) / scoredSubjects.length)
      : 0;
    const overallGrade = scoredSubjects.length ? gradeFor(avgScore, 100) : "—";

    return {
      id: student.id,
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      admissionNumber: student.admissionNumber,
      gender: student.gender,
      subjects,
      summary: { avgScore, totalSubjects: scoredSubjects.length, overallGrade },
    };
  });

  return { className: "", session, term, students: results };
}


export async function getStudentResult(studentId: string, session: string, term: string) {
  const student = await prisma.student.findUnique({ where: { id: studentId }, include: { class: true } });
  if (!student || !student.classId) throw new Error("Student not found or not assigned to a class");

  const classResults = await getClassResults(student.classId, session, term);
  if (!classResults) return null;

  const me = classResults.students.find((s) => s.id === studentId);
  if (!me) return null;

  // Rank: sort everyone who's actually been scored by their average, descending
  const scored = classResults.students.filter((s) => s.summary.totalSubjects > 0);
  scored.sort((a, b) => b.summary.avgScore - a.summary.avgScore);
  const rank = scored.findIndex((s) => s.id === studentId) + 1;

  const attendanceRecords = await findAttendanceStats(studentId);
  const presentCount = attendanceRecords.filter((r) => r.status === "PRESENT").length;
  const attendancePercentage = attendanceRecords.length ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;

  return {
    student: { id: student.id, firstName: student.firstName, middleName: student.middleName, lastName: student.lastName, admissionNumber: student.admissionNumber, gender: student.gender, class: { id: student.class!.id, className: student.class!.className } },
    session,
    term,
    subjects: me.subjects,
    summary: {
      avgScore: me.summary.avgScore,
      totalSubjects: me.summary.totalSubjects,
      overallGrade: me.summary.overallGrade,
      rank: rank || null,
      outOf: scored.length,
      attendancePercentage,
    },
  };
}