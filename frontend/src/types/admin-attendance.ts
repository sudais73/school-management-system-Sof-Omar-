export type ClassAttendanceRow = {
  id: string;
  className: string;
  teacherName: string;
  totalStudents: number;
  submitted: boolean;
  attendanceId: string | null;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  submittedAt: string | null;
};

export type DailySummary = {
  totalClasses: number;
  submittedCount: number;
  notSubmittedCount: number;
  notSubmittedClasses: string[];
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
};

export type StudentAttendanceRecord = { studentId: string; name: string; admissionNumber: string; gender: string; status: string };

export type StudentHistorySummary = { percentage: number; presentCount: number; absentCount: number; lateCount: number; excusedCount: number };
export type StudentHistoryRecord = { date: string; className: string; status: string };