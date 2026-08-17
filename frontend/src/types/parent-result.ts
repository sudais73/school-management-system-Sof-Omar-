export type ChildComponentScore = { name: string; score: number | null; maxScore: number };
export type ChildSubjectResult = { subjectName: string; components: ChildComponentScore[]; total: number; grandMax: number; grade: string; remark: string };
export type ChildResult = {
  student: { id: string; firstName: string; middleName: string | null; lastName: string; admissionNumber: string; gender: string; class: { className: string } };
  session: string; term: string;
  subjects: ChildSubjectResult[];
  summary: { avgScore: number; totalSubjects: number; overallGrade: string; rank: number | null; outOf: number; attendancePercentage: number };
};