import { apiClient } from "@/lib/api";
import type { AttendanceStatus } from "@/types/attendance";

export async function fetchAttendance(classId: string, date: string) {
  const { data } = await apiClient.get<{ statusMap: Record<string, AttendanceStatus>; isEdit: boolean }>(
    "/api/teacher/attendance",
    { params: { classId, date } }
  );
  return data;
}

export async function saveAttendance(classId: string, date: string, records: { studentId: string; status: AttendanceStatus }[]) {
  const { data } = await apiClient.post("/api/teacher/attendance", { classId, date, records });
  return data as { isEdit: boolean };
}