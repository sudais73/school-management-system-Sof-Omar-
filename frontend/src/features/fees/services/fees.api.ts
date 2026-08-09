import { apiClient } from "@/lib/api";
import type { FeeStructure, StudentFeeRecord } from "@/types/fee";

export async function fetchStructures(classId: string, session: string, term: string) {
  const { data } = await apiClient.get<{ structures: FeeStructure[] }>("/api/fees/structures", {
    params: { classId, session, term },
  });
  return data.structures;
}

export async function createStructure(payload: {
  classId: string;
  session: string;
  term: string;
  name: string;
  description?: string;
  dueDate: string;
  items: { name: string; amount: number }[];
}) {
  const { data } = await apiClient.post<{ structure: FeeStructure }>("/api/fees/structures", payload);
  return data.structure;
}

export async function fetchStudentFees(structureId: string) {
  const { data } = await apiClient.get<{ fees: StudentFeeRecord[] }>("/api/fees/student-fees", {
    params: { structureId },
  });
  return data.fees;
}

export async function recordPayment(payload: {
  studentFeeId: string;
  amount: number;
  receiptNumber?: string;
  note?: string;
}) {
  const { data } = await apiClient.post("/api/fees/payments", payload);
  return data;
}