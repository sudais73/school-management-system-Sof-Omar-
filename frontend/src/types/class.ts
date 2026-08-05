export type SchoolClass = {
  id: string;
  className: string;
  capacity: number | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  students: { id: string }[];
  subjects: { id: string; name: string }[];
};