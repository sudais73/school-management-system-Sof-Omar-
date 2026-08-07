export type TeacherSubjectItem = {
  id: string;
  name: string;
  class: { id: string; className: string };
};

export type TeacherListItem = {
  id: string;
  employeeId: string | null;
  gender: "MALE" | "FEMALE" | null;
  department: string | null;
  designation: "TEACHER" | "CASHIER" | "ADMIN" | null;
  phone: string | null;
  createdAt: string;
  user: { id: string; fullName: string; email: string };
  subjects: TeacherSubjectItem[];
  classesOwned: { id: string; className: string }[];
};

export type ClassWithSubjectsForAssignment = {
  id: string;
  className: string;
  subjects: { id: string; name: string }[];
};