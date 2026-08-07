import { apiClient } from "@/lib/api";
import type { ClassWithSubjects } from "@/types/subject";

export async function fetchClassesWithSubjects() {
  const { data } = await apiClient.get<ClassWithSubjects[]>("/subjects");
  return data;
}

export async function createSubjectRequest(classId: string, name: string) {
  const { data } = await apiClient.post("/subjects", { classId, name });
  return data;
}