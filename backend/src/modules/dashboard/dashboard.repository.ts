import  prisma from "@/config/prisma";

export function countTotals() {
  return Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.class.count(),
  ]);
}

export function findTodayAttendanceSessions(date: Date) {
  return prisma.attendance.findMany({ where: { date }, include: { records: true } });
}

export function sumFees() {
  return prisma.studentFee.aggregate({ _sum: { totalAmount: true, amountPaid: true } });
}