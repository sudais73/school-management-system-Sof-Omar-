export type SchoolClass = {
  id: string;
  className: string;
  capacity: number | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  students: { id: string }[];
  subjects: { id: string; name: string }[];
};
export type SubjectWithTeacher = {
  id: string;
  name: string;
  teacher: {
    id: string;
    user: { id: string; fullName: string; email: string };
  } | null;
};

export type SchoolClassDetail = SchoolClass & {
  subjects: SubjectWithTeacher[];
};