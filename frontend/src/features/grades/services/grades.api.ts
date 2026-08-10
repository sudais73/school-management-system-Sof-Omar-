import { apiClient } from "@/lib/api";
import type { TeacherClass, GradeStructure, MarkRow } from "@/types/grade";

export async function fetchMyClasses() {
  const { data } = await apiClient.get<{ classes: TeacherClass[] }>("/api/teacher/classes");
  return data.classes;
}

export async function fetchStructure(classId: string, subjectId: string, term: string, session: string) {
  const { data } = await apiClient.get<{ structure: GradeStructure | null }>("/api/teacher/grade-structure", {
    params: { classId, subjectId, term, session },
  });
  return data.structure;
}

export async function createStructure(payload: {
  classId: string; subjectId: string; title: string; term: string; session: string;
  components: { name: string; maxScore: number }[];
}) {
  const { data } = await apiClient.post<{ structure: GradeStructure }>("/api/teacher/grade-structure", payload);
  return data.structure;
}

export async function fetchMarks(componentId: string) {
  const { data } = await apiClient.get<{ marks: MarkRow[] }>("/api/teacher/marks", { params: { componentId } });
  return data.marks;
}

export async function saveMarks(componentId: string, marks: MarkRow[], action: "draft" | "release") {
  const { data } = await apiClient.post("/api/teacher/marks", { componentId, marks, action });
  return data;
}