import { apiClient } from "@/lib/api";
import type { StudentListItem } from "@/types/student";

export async function fetchStudents() {
  const { data } = await apiClient.get<{ students: StudentListItem[] }>("/api/students");
  return data.students;
}

export type CreateStudentPayload = {
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  residentialAddress?: string;
  stateOfOrigin?: string;
  nationality?: string;
  classId?: string;
  admissionDate?: string;
  previousSchool?: string;
  status?: string;
  guardianName: string;
  guardianRelationship?: string;
  guardianPhone: string;
  guardianOccupation?: string;
  guardianEmail?: string;
  guardianAddress?: string;
};

export async function createStudentRequest(payload: CreateStudentPayload) {
  const { data } = await apiClient.post<{ student: StudentListItem; generatedEmail: string; setupOtp: string }>(
    "/api/students",
    payload
  );
  return data;
}