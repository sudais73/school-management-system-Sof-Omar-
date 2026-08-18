import { countTotals, findTodayAttendanceSessions, sumFees } from "./dashboard.repository";

function todayMidnight(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getAdminSummary() {
  const [totalStudents, totalTeachers, totalClasses] = await countTotals();

  const sessions = await findTodayAttendanceSessions(todayMidnight());
  const allRecords = sessions.flatMap((s) => s.records);
  const presentToday = allRecords.filter((r) => r.status === "PRESENT").length;
  const attendanceRate = allRecords.length ? Math.round((presentToday / allRecords.length) * 100) : null;

  const feeTotals = await sumFees();
  const feesExpected = feeTotals._sum.totalAmount ?? 0;
  const feesCollected = feeTotals._sum.amountPaid ?? 0;

  return {
    totalStudents,
    totalTeachers,
    totalClasses,
    attendanceToday: { rate: attendanceRate, classesSubmitted: sessions.length, totalClasses },
    fees: { expected: feesExpected, collected: feesCollected, percentage: feesExpected ? Math.round((feesCollected / feesExpected) * 100) : 0 },
  };
}