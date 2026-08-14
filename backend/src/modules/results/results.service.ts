import { findPublishedStructures, findClassStudents, findMarksForComponents } from "./results.repository";
import { gradeFor, remarkFor } from "@/utils/grade.util";

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
      const hasAny = components.some((c) => c.score !== null);
      const total = components.reduce((sum, c) => sum + (c.score ?? 0), 0);
      const grade = hasAny ? gradeFor(total, grandMax) : "—";

      return {
        subjectName: structure.subject.name,
        components,
        total,
        grandMax,
        grade,
        remark: hasAny ? remarkFor(grade) : "Not yet scored",
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

  return { className: withScores[0]?.class?.className ?? "", session, term, students: results };
}