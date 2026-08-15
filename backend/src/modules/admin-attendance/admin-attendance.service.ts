import * as repo from "./admin-attendance.repository";

function normalizeDate(dateStr: string): Date {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDailyOverview(dateStr: string) {
  const date = normalizeDate(dateStr);
  const classes = await repo.findClassesWithDailyAttendance(date);

  const rows = classes.map((cls) => {
    const session = cls.attendances[0] ?? null;
    const records = session?.records ?? [];

    return {
      id: cls.id,
      className: cls.className,
      teacherName: cls.homeroomTeacher?.user.fullName ?? "Unassigned",
      totalStudents: cls.students.length,
      submitted: !!session,
      attendanceId: session?.id ?? null,
      presentCount: records.filter((r) => r.status === "PRESENT").length,
      absentCount: records.filter((r) => r.status === "ABSENT").length,
      lateCount: records.filter((r) => r.status === "LATE").length,
      excusedCount: records.filter((r) => r.status === "EXCUSED").length,
      submittedAt: session?.createdAt ?? null,
    };
  });

  const summary = {
    totalClasses: rows.length,
    submittedCount: rows.filter((r) => r.submitted).length,
    notSubmittedCount: rows.filter((r) => !r.submitted).length,
    notSubmittedClasses: rows.filter((r) => !r.submitted).map((r) => r.className),
    totalPresent: rows.reduce((sum, r) => sum + r.presentCount, 0),
    totalAbsent: rows.reduce((sum, r) => sum + r.absentCount, 0),
    totalLate: rows.reduce((sum, r) => sum + r.lateCount, 0),
    totalExcused: rows.reduce((sum, r) => sum + r.excusedCount, 0),
  };

  return { summary, classes: rows };
}

export async function getClassAttendanceDetail(classId: string, dateStr: string) {
  const date = normalizeDate(dateStr);
  const attendance = await repo.findClassAttendanceDetail(classId, date);
  if (!attendance) return { records: [] };

  return {
    records: attendance.records.map((r) => ({
      studentId: r.studentId,
      name: `${r.student.firstName} ${r.student.lastName}`,
      admissionNumber: r.student.admissionNumber,
      gender: r.student.gender,
      status: r.status,
    })),
  };
}

export async function getStudentAttendanceHistory(studentId: string) {
  const records = await repo.findStudentAttendanceHistory(studentId);

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;
  const excusedCount = records.filter((r) => r.status === "EXCUSED").length;
  const percentage = records.length ? Math.round((presentCount / records.length) * 100) : 0;

  return {
    summary: { percentage, presentCount, absentCount, lateCount, excusedCount },
    records: records.map((r) => ({
      date: r.attendance.date,
      className: r.attendance.class.className,
      status: r.status,
    })),
  };
}