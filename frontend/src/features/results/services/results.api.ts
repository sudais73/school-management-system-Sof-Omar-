import { apiClient } from "@/lib/api";
import type { ClassResults } from "@/types/result";

export async function fetchClassResults(classId: string, session: string, term: string) {
  const { data } = await apiClient.get<{ result: ClassResults }>("/api/admin/results", { params: { classId, session, term } });
  return data.result;
}