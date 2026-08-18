import { apiClient } from "@/lib/api";

export type AdminSummary = {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceToday: { rate: number | null; classesSubmitted: number; totalClasses: number };
  fees: { expected: number; collected: number; percentage: number };
};

export async function fetchAdminSummary() {
  const { data } = await apiClient.get<{ summary: AdminSummary }>("/api/dashboard/admin-summary");
  return data.summary;
}

export type TeacherSummary = {
  totalClasses: number;
  totalStudents: number;
  totalSubjects: number;
  homeroomClass: { id: string; className: string; studentCount: number } | null;
  homeroomAttendanceSubmittedToday: boolean | null;
};

export async function fetchTeacherSummary() {
  const { data } = await apiClient.get<{ summary: TeacherSummary }>("/api/teacher/summary");
  return data.summary;
}