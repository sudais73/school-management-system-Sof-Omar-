export type ComponentStatus = "DRAFT" | "PUBLISHED";

export type GradeComponent = {
  id: string;
  name: string;
  maxScore: number;
  order: number;
  status: ComponentStatus;
};

export type GradeStructure = {
  id: string;
  title: string;
  term: string;
  session: string;
  components: GradeComponent[];
};

export type TeacherClassStudent = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  admissionNumber: string;
  gender: "MALE" | "FEMALE" | null;
};

export type TeacherClass = {
  id: string;
  className: string;
  students: TeacherClassStudent[];
  subjects: { id: string; name: string }[];
};

export type MarkRow = { studentId: string; score: number };