import { apiClient } from "#/lib/api";
import type { SchoolClass } from "@/types/class";

export async function fetchClasses() {
  const { data } = await apiClient.get<{ classes: SchoolClass[] }>("/api/classes");
  return data.classes;
}

export async function createClass(className: string, capacity?: number) {
  const { data } = await apiClient.post<{ class: SchoolClass }>("/api/classes", { className, capacity });
  return data.class;
}