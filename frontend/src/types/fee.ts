export type FeeStatus = "PENDING" | "PARTIAL" | "PAID";

export type FeeItem = { id: string; name: string; amount: number };

export type FeeStructure = {
  id: string;
  classId: string;
  session: string;
  term: string;
  name: string;
  description: string | null;
  dueDate: string;
  items: FeeItem[];
};

export type PaymentRecord = {
  id: string;
  amount: number;
  receiptNumber: string | null;
  note: string | null;
  paymentDate: string;
  editedAt: string | null;
};

export type StudentFeeRecord = {
  id: string;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  status: FeeStatus;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    gender: "MALE" | "FEMALE" | null;
    guardianName: string | null;
    guardianPhone: string | null;
  };
  feeStructure: { items: FeeItem[] };
  payments: PaymentRecord[];
};