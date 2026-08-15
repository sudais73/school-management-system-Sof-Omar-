import prisma  from "@/config/prisma";

export function findClassesWithDailyAttendance(date: Date) {
  return prisma.class.findMany({
    include: {
      homeroomTeacher: { include: { user: { select: { fullName: true } } } },
      students: { select: { id: true } },
      attendances: { where: { date }, include: { records: true } },
    },
    orderBy: { className: "asc" },
  });
}

export function findClassAttendanceDetail(classId: string, date: Date) {
  return prisma.attendance.findUnique({
    where: { classId_date: { classId, date } },
    include: {
      records: {
        include: { student: { select: { firstName: true, lastName: true, admissionNumber: true, gender: true } } },
      },
    },
  });
}

export function findStudentAttendanceHistory(studentId: string) {
  return prisma.attendanceRecord.findMany({
    where: { studentId },
    include: { attendance: { include: { class: { select: { className: true } } } } },
    orderBy: { attendance: { date: "desc" } },
  });
}