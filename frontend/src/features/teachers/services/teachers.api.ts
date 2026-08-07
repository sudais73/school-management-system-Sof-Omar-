import { apiClient } from "@/lib/api";
import type { TeacherListItem } from "@/types/teacher";

export async function fetchTeachers() {
  const { data } = await apiClient.get<{ teachers: TeacherListItem[] }>("/teachers");
  return data.teachers;
}

export type CreateTeacherPayload = {
  fullName: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  phone?: string;
  alternatePhone?: string;
  residentialAddress?: string;
  employmentDate?: string;
  employmentType?: string;
  department?: string;
  designation?: string;
  highestQualification?: string;
  specialization?: string;
  professionalCertification?: string;
  classId: string;
  subjectIds: string[];
  isHomeroomTeacher: boolean;
};

export async function createTeacherRequest(payload: CreateTeacherPayload) {
  const { data } = await apiClient.post<{ teacher: TeacherListItem; setupOtp: string }>("/api/teachers", payload);
  return data;
}