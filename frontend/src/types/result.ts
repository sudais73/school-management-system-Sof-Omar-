export type ComponentResult = { name: string; maxScore: number; score: number | null };
export type SubjectResult = { subjectName: string; components: ComponentResult[]; total: number; grandMax: number; grade: string; remark: string };
export type StudentResult = {
  id: string; firstName: string; middleName: string | null; lastName: string;
  admissionNumber: string; gender: "MALE" | "FEMALE" | null;
  subjects: SubjectResult[];
  summary: { avgScore: number; totalSubjects: number; overallGrade: string };
};
export type ClassResults = { className: string; session: string; term: string; students: StudentResult[] };