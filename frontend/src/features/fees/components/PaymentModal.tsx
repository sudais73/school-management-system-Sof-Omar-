import { useState } from "react";
import { X, Receipt, CheckCircle } from "lucide-react";
import { recordPayment } from "../services/fees.api";
import type { StudentFeeRecord } from "@/types/fee";

const fmt = (n: number) => `Br ${n.toLocaleString()}`;

export function PaymentModal({ fee, onClose, onRecorded }: { fee: StudentFeeRecord; onClose: () => void; onRecorded: () => void }) {
  const [amount, setAmount] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    const amt = Number(amount);
    if (!amt || amt <= 0) return setError("Enter a valid amount");
    if (amt > fee.balance) return setError(`Amount cannot exceed balance of ${fmt(fee.balance)}`);

    setSaving(true);
    try {
      await recordPayment({ studentFeeId: fee.id, amount: amt, receiptNumber: receiptNumber || undefined, note: note || undefined });
      onRecorded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to record payment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-ink">Payment</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-5 rounded-xl bg-chalk p-4">
            <p className="mb-2 font-semibold text-ink">{fee.student.firstName} {fee.student.lastName}</p>
            <div className="space-y-1 border-t border-ulead-line pt-2 text-sm">
              <div className="flex justify-between"><span className="text-ulead-slate">Total due</span><span className="font-semibold text-ink">{fmt(fee.totalAmount)}</span></div>
              <div className="flex justify-between"><span className="text-ulead-slate">Already paid</span><span className="font-semibold text-evergreen-deep">{fmt(fee.amountPaid)}</span></div>
              <div className="flex justify-between"><span className="font-semibold text-ink">Balance</span><span className="font-bold text-red-600">{fmt(fee.balance)}</span></div>
            </div>
          </div>

          {fee.payments.length > 0 && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ulead-slate">Payment history</p>
              <div className="space-y-1.5">
                {fee.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg bg-chalk px-3 py-2 text-sm">
                    <span className="font-semibold text-evergreen-deep">{fmt(p.amount)}</span>
                    <span className="text-xs text-ulead-slate">{new Date(p.paymentDate).toLocaleDateString()}{p.receiptNumber && ` · #${p.receiptNumber}`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {fee.balance > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ulead-slate">Record new payment</p>
              <div>
                <label className="mb-1.5 block text-xs text-ulead-slate">Amount paying (max {fmt(fee.balance)})</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-full rounded-lg border border-ulead-line px-3 py-2.5 text-sm outline-none focus:border-evergreen" />
                <button onClick={() => setAmount(String(fee.balance))} className="mt-2 rounded-lg bg-evergreen/10 px-2.5 py-1 text-xs font-semibold text-evergreen-deep hover:bg-evergreen/20">
                  Full balance ({fmt(fee.balance)})
                </button>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-ulead-slate">Receipt number (optional)</label>
                <input value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-ulead-slate">Note (optional)</label>
                <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-evergreen/20 bg-evergreen/[0.06] p-3">
              <CheckCircle size={16} className="text-evergreen-deep" />
              <p className="text-sm font-semibold text-evergreen-deep">Fully paid — no balance remaining</p>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex gap-3 border-t px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-lg border border-ulead-line py-2.5 text-sm font-semibold text-ink hover:bg-chalk">Close</button>
          {fee.balance > 0 && (
            <button onClick={handleSubmit} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep disabled:opacity-60">
              <Receipt size={15} />
              {saving ? "Recording..." : "Record payment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}