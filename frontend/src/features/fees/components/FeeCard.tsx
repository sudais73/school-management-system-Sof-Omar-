import { Receipt } from "lucide-react";
import type { StudentFeeRecord } from "@/types/fee";

const fmt = (n: number) => `Br ${n.toLocaleString()}`;

const statusStyle: Record<string, string> = {
  PAID: "bg-evergreen/10 text-evergreen-deep",
  PARTIAL: "bg-marigold/15 text-marigold-deep",
  PENDING: "bg-gray-100 text-gray-600",
};

export function FeeCard({ fee, onPay }: { fee: StudentFeeRecord; onPay: () => void }) {
  return (
    <div className="rounded-2xl border border-ulead-line bg-chalk-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">{fee.student.firstName} {fee.student.lastName}</p>
          <p className="font-mono text-xs text-ulead-slate">{fee.student.admissionNumber}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[fee.status]}`}>{fee.status}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-ulead-line pt-3 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ulead-slate">Total</p>
          <p className="text-sm font-bold text-ink">{fmt(fee.totalAmount)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ulead-slate">Paid</p>
          <p className="text-sm font-bold text-evergreen-deep">{fmt(fee.amountPaid)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ulead-slate">Balance</p>
          <p className="text-sm font-bold text-red-600">{fmt(fee.balance)}</p>
        </div>
      </div>

      {fee.student.guardianName && (
        <p className="mt-3 border-t border-ulead-line pt-3 text-xs text-ulead-slate">
          Guardian: <span className="font-medium text-ink">{fee.student.guardianName}</span>
          {fee.student.guardianPhone && ` · ${fee.student.guardianPhone}`}
        </p>
      )}

      <button
        onClick={onPay}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-evergreen py-2.5 text-xs font-semibold text-white hover:bg-evergreen-deep"
      >
        <Receipt size={13} />
        {fee.status === "PAID" ? "View Payment History" : "Record Payment"}
      </button>
    </div>
  );
}