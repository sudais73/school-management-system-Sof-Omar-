import  prisma  from "@/config/prisma";

export function createFeeStructure(data: {
  classId: string;
  session: string;
  term: string;
  name: string;
  dueDate: Date;
  description?: string;
  items: { name: string; amount: number }[];
}) {
  return prisma.$transaction(async (tx) => {
    const structure = await tx.feeStructure.create({
      data: {
        classId: data.classId,
        session: data.session,
        term: data.term,
        name: data.name,
        dueDate: data.dueDate,
        description: data.description,
        items: { create: data.items },
      },
      include: { items: true },
    });

    const totalAmount = structure.items.reduce((sum, item) => sum + item.amount, 0);

    // Every student currently in this class gets a StudentFee row —
    // this is the "generated for each student" step.
    const students = await tx.student.findMany({ where: { classId: data.classId }, select: { id: true } });

    if (students.length > 0) {
      await tx.studentFee.createMany({
        data: students.map((s) => ({
          studentId: s.id,
          feeStructureId: structure.id,
          totalAmount,
          amountPaid: 0,
          balance: totalAmount,
          status: "PENDING" as const,
        })),
      });
    }

    return structure;
  });
}

export function findStructuresByClass(classId: string, session: string, term: string) {
  return prisma.feeStructure.findMany({
    where: { classId, session, term },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export function findStudentFeesByStructure(feeStructureId: string) {
  return prisma.studentFee.findMany({
    where: { feeStructureId },
    include: {
      student: { select: { id: true, firstName: true, lastName: true, admissionNumber: true, gender: true, guardianName: true, guardianPhone: true, guardianEmail: true } },
      feeStructure: { include: { items: true } },
      payments: { orderBy: { paymentDate: "desc" } },
    },
  });
}

export function recordPayment(input: {
  studentFeeId: string;
  amount: number;
  receiptNumber?: string;
  note?: string;
  recordedById: string;
}) {
  return prisma.$transaction(async (tx) => {
    const studentFee = await tx.studentFee.findUnique({ where: { id: input.studentFeeId } });
    if (!studentFee) throw new Error("Fee record not found");

    // Guard against a payment that would push balance below zero —
    // enforced here, not just trusted from the frontend's max attribute.
    if (input.amount > studentFee.balance) {
      throw new Error("Payment amount exceeds remaining balance");
    }

    const payment = await tx.payment.create({
      data: {
        studentFeeId: input.studentFeeId,
        amount: input.amount,
        receiptNumber: input.receiptNumber,
        note: input.note,
        recordedById: input.recordedById,
      },
    });

    const newAmountPaid = studentFee.amountPaid + input.amount;
    const newBalance = studentFee.totalAmount - newAmountPaid;

    const updated = await tx.studentFee.update({
      where: { id: input.studentFeeId },
      data: {
        amountPaid: newAmountPaid,
        balance: newBalance,
        status: newBalance <= 0 ? "PAID" : "PARTIAL",
      },
    });

    return { payment, studentFee: updated };
  });
}