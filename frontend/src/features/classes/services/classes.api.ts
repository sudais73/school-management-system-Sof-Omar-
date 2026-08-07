import { apiClient } from "#/lib/api";
import type { SchoolClass, SchoolClassDetail } from "@/types/class";

export async function fetchClasses() {
  const { data } = await apiClient.get<{ classes: SchoolClass[] }>("/classes");
  return data.classes;
}

export async function createClass(className: string, capacity?: number) {
  const { data } = await apiClient.post<{ class: SchoolClass }>("/classes", { className, capacity });
  return data.class;
}

export async function getClassById(id: string) {
  const { data } = await apiClient.get<{ class: SchoolClassDetail }>(`/classes/${id}`);
  return data.class;
}