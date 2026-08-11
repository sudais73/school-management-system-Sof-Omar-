import prisma  from "@/config/prisma";

export function findSession(classId: string, date: Date) {
  return prisma.attendance.findUnique({
    where: { classId_date: { classId, date } },
    include: { records: true },
  });
}

export async function upsertSession(classId: string, teacherId: string, date: Date, records: { studentId: string; status: string }[]) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.attendance.upsert({
      where: { classId_date: { classId, date } },
      create: { classId, teacherId, date },
      update: { teacherId }, // whoever last edits becomes the recorded teacher for this session
    });

    await Promise.all(
      records.map((r) =>
        tx.attendanceRecord.upsert({
          where: { attendanceId_studentId: { attendanceId: session.id, studentId: r.studentId } },
          create: { attendanceId: session.id, studentId: r.studentId, status: r.status as any },
          update: { status: r.status as any },
        })
      )
    );

    return session;
  });
}