import { apiClient } from "@/lib/api";
import type { ChildResult } from "@/types/parent-result";

export async function fetchMyChildren() {
  const { data } = await apiClient.get("/api/parents/my-children");
  return data.students as { id: string; firstName: string; middleName: string | null; lastName: string; admissionNumber: string; gender: string; class: { className: string } | null }[];
}

export async function fetchChildResult(studentId: string, session: string, term: string) {
  const { data } = await apiClient.get<{ result: ChildResult }>("/api/parents/results", { params: { studentId, session, term } });
  return data.result;
}