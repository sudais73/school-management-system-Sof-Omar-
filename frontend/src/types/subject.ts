export type SubjectItem = {
  id: string;
  name: string;
  teacher: { id: string; user: { id: string; fullName: string } } | null;
};

export type ClassWithSubjects = {
  id: string;
  className: string;
  subjects: SubjectItem[];
};