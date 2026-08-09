import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { fetchClasses } from "@/features/classes/services/classes.api";
import { fetchStructures, fetchStudentFees } from "@/features/fees/services/fees.api";
import { AddFeeStructureForm } from "@/features/fees/components/AddFeeStructureForm";
import { PaymentModal } from "@/features/fees/components/PaymentModal";
import type { SchoolClass } from "@/types/class";
import type { FeeStructure, StudentFeeRecord } from "@/types/fee";
import { FeeCard } from "#/features/fees/components/FeeCard";

export const Route = createFileRoute("/dashboard/fees")({
  component: FeesPage,
});

const SESSIONS = ["2025/2026", "2026/2027", "2024/2025"];
const TERMS = ["Semester 1", "Semester 2"];
const fmt = (n: number) => `Br ${n.toLocaleString()}`;

const statusStyle: Record<string, string> = {
  PAID: "bg-evergreen/10 text-evergreen-deep",
  PARTIAL: "bg-marigold/15 text-marigold-deep",
  PENDING: "bg-gray-100 text-gray-600",
};

function FeesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [classId, setClassId] = useState("");
  const [session, setSession] = useState(SESSIONS[0]);
  const [term, setTerm] = useState(TERMS[0]);

  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [activeStructId, setActiveStructId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [fees, setFees] = useState<StudentFeeRecord[]>([]);
  const [payingFee, setPayingFee] = useState<StudentFeeRecord | null>(null);

  useEffect(() => {
    fetchClasses().then((cls) => {
      setClasses(cls);
      if (cls.length > 0) setClassId(cls[0].id);
    });
  }, []);

  function loadStructures() {
    if (!classId) return;
    fetchStructures(classId, session, term).then((list) => {
      setStructures(list);
      setActiveStructId(list[0]?.id ?? null);
    });
  }

  useEffect(loadStructures, [classId, session, term]);

  function loadFees() {
    if (activeStructId) fetchStudentFees(activeStructId).then(setFees);
  }

  useEffect(loadFees, [activeStructId]);

  const activeStructure = structures.find((s) => s.id === activeStructId) ?? null;
  const total = activeStructure?.items.reduce((sum, i) => sum + i.amount, 0) ?? 0;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-ink">Fee Management</h1>

      <div className="mb-5 grid grid-cols-1 gap-4 rounded-2xl border border-ulead-line bg-chalk-card p-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ulead-slate">Class</label>
          <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2.5 text-sm outline-none focus:border-evergreen">
            {classes.map((c) => <option key={c.id} value={c.id}>{c.className}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ulead-slate">Session</label>
          <select value={session} onChange={(e) => setSession(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2.5 text-sm outline-none focus:border-evergreen">
            {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ulead-slate">Semester</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2.5 text-sm outline-none focus:border-evergreen">
            {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-start gap-3">
        <div className="flex flex-1 flex-wrap gap-2">
          {structures.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStructId(s.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeStructId === s.id ? "bg-evergreen text-white" : "border border-ulead-line bg-white text-ulead-slate hover:bg-chalk"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-evergreen px-4 py-2 text-sm font-semibold text-white hover:bg-evergreen-deep">
          <Plus size={16} /> Add Payment
        </button>
      </div>

      {showForm && classId && (
        <AddFeeStructureForm classId={classId} session={session} term={term} onClose={() => setShowForm(false)} onSaved={loadStructures} />
      )}

      {!showForm && structures.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ulead-line bg-chalk-card py-16 text-center text-sm text-ulead-slate">
          No payments defined yet for this class/session/semester.
        </div>
      )}

      {activeStructure && (
        <div className="mb-5 rounded-2xl border border-ulead-line bg-chalk-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-semibold text-ink">{activeStructure.name}</h3>
              {activeStructure.description && <p className="text-xs text-ulead-slate">{activeStructure.description}</p>}
            </div>
            <p className="text-xs text-ulead-slate">Due {new Date(activeStructure.dueDate).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeStructure.items.map((item) => (
              <div key={item.id} className="rounded-lg bg-chalk px-3 py-2">
                <p className="text-xs text-ulead-slate">{item.name}</p>
                <p className="text-sm font-bold text-ink">{fmt(item.amount)}</p>
              </div>
            ))}
            <div className="rounded-lg bg-evergreen/10 px-3 py-2">
              <p className="text-xs font-semibold text-evergreen-deep">Total</p>
              <p className="text-sm font-bold text-evergreen-deep">{fmt(total)}</p>
            </div>
          </div>
        </div>
      )}
{/* Mobile */}
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {fees.map((fee) => (
        <FeeCard key={fee.id} fee={fee} onPay={() => setPayingFee(fee)} />
      ))}
    </div>
      {fees.length > 0 && (
        <div className="hidden md:block overflow-hidden rounded-2xl border border-ulead-line bg-chalk-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-ulead-line bg-chalk">
                <tr>
                  {["Student", "Guardian", "Total", "Paid", "Balance", "Status", "Action"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ulead-slate">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ulead-line">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-chalk/60">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-ink">{fee.student.firstName} {fee.student.lastName}</p>
                      <p className="font-mono text-xs text-ulead-slate">{fee.student.admissionNumber}</p>
                    </td>
                    <td className="px-5 py-3 text-xs text-ulead-slate">
                      {fee.student.guardianName ?? "—"}
                      {fee.student.guardianPhone && <div>{fee.student.guardianPhone}</div>}
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-ink">{fmt(fee.totalAmount)}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-evergreen-deep">{fmt(fee.amountPaid)}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-red-600">{fmt(fee.balance)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[fee.status]}`}>{fee.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => setPayingFee(fee)} className="flex items-center gap-1.5 rounded-lg bg-evergreen px-3 py-1.5 text-xs font-semibold text-white hover:bg-evergreen-deep">
                        <Receipt size={12} />
                        {fee.status === "PAID" ? "View" : "Record Payment"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {payingFee && (
        <PaymentModal fee={payingFee} onClose={() => setPayingFee(null)} onRecorded={() => { loadFees(); }} />
      )}
    </div>
  );
}