import { apiClient } from "@/lib/api";
import type { DailySummary, ClassAttendanceRow, StudentAttendanceRecord, StudentHistorySummary, StudentHistoryRecord } from "@/types/admin-attendance";

export async function fetchDailyOverview(date: string) {
  const { data } = await apiClient.get<{ summary: DailySummary; classes: ClassAttendanceRow[] }>("/api/admin/attendance/daily", { params: { date } });
  return data;
}

export async function fetchClassAttendance(classId: string, date: string) {
  const { data } = await apiClient.get<{ records: StudentAttendanceRecord[] }>("/api/admin/attendance/class", { params: { classId, date } });
  return data.records;
}

export async function fetchStudentHistory(studentId: string) {
  const { data } = await apiClient.get<{ summary: StudentHistorySummary; records: StudentHistoryRecord[] }>("/api/admin/attendance/student", { params: { studentId } });
  return data;
}

export async function searchStudents(query: string) {
  const { data } = await apiClient.get("/api/students", { params: { search: query } });
  return data.students.slice(0, 6);
}