import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Loader2, Download, Printer } from "lucide-react";
import { fetchMyChildren, fetchChildResult } from "@/features/parents/services/parent-results.api";
import { SESSIONS, TERMS } from "@/lib/academic-constants";
import type { ChildResult } from "@/types/parent-result";

export const Route = createFileRoute("/dashboard/parent/results")({
  component: ViewResultPage,
});

const gradeColor: Record<string, string> = { A: "text-evergreen-deep", B: "text-ink", C: "text-marigold-deep", D: "text-orange-600", F: "text-red-600" };

function scoreColor(score: number, maxScore: number) {
  const pct = (score / maxScore) * 100;
  if (pct >= 70) return "text-evergreen-deep font-semibold";
  if (pct >= 60) return "text-ink font-semibold";
  if (pct >= 50) return "text-marigold-deep font-semibold";
  if (pct >= 45) return "text-orange-600 font-semibold";
  return "text-red-600 font-semibold";
}

function ViewResultPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [childId, setChildId] = useState("");
  const [session, setSession] = useState(SESSIONS[0]);
  const [term, setTerm] = useState(TERMS[0]);

  const [result, setResult] = useState<ChildResult | null>(null);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingResult, setLoadingResult] = useState(false);
  const [error, setError] = useState("");

  const selectedChild = useMemo(() => children.find((c) => c.id === childId) ?? null, [children, childId]);

  useEffect(() => {
    fetchMyChildren().then((kids) => {
      setChildren(kids);
      if (kids.length > 0) setChildId(kids[0].id);
      setLoadingChildren(false);
    });
  }, []);

  useEffect(() => {
    if (!childId) return;
    setLoadingResult(true);
    setResult(null);
    setError("");
    fetchChildResult(childId, session, term)
      .then(setResult)
      .catch((err) => setError(err.response?.data?.message ?? "Failed to load result"))
      .finally(() => setLoadingResult(false));
  }, [childId, session, term]);

  if (loadingChildren) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-evergreen" size={28} /></div>;

  return (
    <div className="print:bg-white">
      <div className="mb-6 flex flex-col md:flex-row gap-3 print:hidden">
        <button onClick={() => window.print()} className="flex items-center gap-2 rounded-lg bg-evergreen px-2 md:px-5 py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep">
          <Download size={16} /> Download Report Card
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 rounded-lg border border-ulead-line bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-chalk">
          <Printer size={16} /> Print
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 rounded-2xl border border-ulead-line bg-chalk-card p-5 sm:grid-cols-3 print:hidden">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ulead-slate">Student</label>
          <select value={childId} onChange={(e) => setChildId(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen">
            {children.map((c) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ulead-slate">Session</label>
          <select value={session} onChange={(e) => setSession(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen">
            {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ulead-slate">Semester</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen">
            {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-ulead-line bg-chalk-card p-5">
        <h3 className="mb-3 font-serif text-base font-semibold text-ink">Student Information</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Field label="Name" value={selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : "—"} />
          <Field label="Admission No." value={selectedChild?.admissionNumber ?? "—"} mono />
          <Field label="Class" value={selectedChild?.class?.className ?? "—"} />
          <Field label="Session" value={session} />
          <Field label="Semester" value={term} />
        </div>
      </div>

      {loadingResult && (
        <div className="flex items-center justify-center rounded-2xl border border-ulead-line bg-chalk-card p-16">
          <Loader2 className="mr-2 animate-spin text-evergreen" size={20} /> <span className="text-sm text-ulead-slate">Loading result...</span>
        </div>
      )}

      {!loadingResult && error && (
        <div className="rounded-2xl border border-ulead-line bg-chalk-card p-12 text-center">
          <p className="text-sm text-ulead-slate">{error}</p>
        </div>
      )}

      {!loadingResult && result && (
        <>
          <div className="mb-5 rounded-2xl border border-ulead-line bg-chalk-card p-5">
            <h3 className="mb-3 font-serif text-base font-semibold text-ink">Performance Summary</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Field label="Average" value={`${result.summary.avgScore}%`} bold />
              <Field label="Subjects" value={String(result.summary.totalSubjects)} />
              <Field label="Class rank" value={result.summary.rank ? `${result.summary.rank} of ${result.summary.outOf}` : "—"} />
              <Field label="Attendance" value={`${result.summary.attendancePercentage}%`} />
              <Field label="Grade" value={result.summary.overallGrade} className={gradeColor[result.summary.overallGrade] ?? ""} bold />
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-ulead-line bg-chalk-card p-5">
  <h3 className="mb-3 font-serif text-base font-semibold text-ink">Result Table</h3>

  {/* Mobile */}
  <div className="space-y-3 md:hidden">
    {result.subjects.map((sub) => (
      <div key={sub.subjectName} className="rounded-xl border border-ulead-line bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">{sub.subjectName}</p>
          <span className={`text-sm font-bold ${sub.grade === "—" ? "text-ulead-line" : gradeColor[sub.grade]}`}>{sub.grade}</span>
        </div>
        <div className="space-y-1.5 border-t border-ulead-line pt-3">
          {sub.components.map((c) => (
            <div key={c.name} className="flex items-center justify-between text-sm">
              <span className="text-ulead-slate">{c.name} <span className="text-xs text-ulead-slate/70">/{c.maxScore}</span></span>
              {c.score !== null ? <span className={scoreColor(c.score, c.maxScore)}>{c.score}</span> : <span className="text-ulead-line">—</span>}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-ulead-line pt-3 text-sm">
          <span className="font-semibold text-ink">Total</span>
          <span className="font-bold text-ink">{sub.total}<span className="ml-1 text-xs font-normal text-ulead-slate">/{sub.grandMax}</span></span>
        </div>
        {sub.grade !== "—" && <p className="mt-1 text-xs text-ulead-slate">{sub.remark}</p>}
      </div>
    ))}
  </div>

  {/* Desktop */}
  <div className="hidden overflow-x-auto md:block">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-ulead-line bg-chalk">
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ulead-slate">Subject</th>
          {result.subjects[0]?.components.map((c) => (
            <th key={c.name} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ulead-slate">{c.name}<span className="ml-1 font-normal normal-case text-ulead-slate/70">/{c.maxScore}</span></th>
          ))}
          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ulead-slate">Total</th>
          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ulead-slate">Grade</th>
          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ulead-slate">Remark</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-ulead-line">
        {result.subjects.map((sub) => (
          <tr key={sub.subjectName} className="hover:bg-chalk/60">
            <td className="px-4 py-3 font-medium text-ink">{sub.subjectName}</td>
            {sub.components.map((c) => (
              <td key={c.name} className="px-4 py-3 text-center">
                {c.score !== null ? <span className={scoreColor(c.score, c.maxScore)}>{c.score}</span> : <span className="text-ulead-line">—</span>}
              </td>
            ))}
            <td className="px-4 py-3 text-center font-bold text-ink">{sub.total}<span className="ml-1 text-xs font-normal text-ulead-slate">/{sub.grandMax}</span></td>
            <td className={`px-4 py-3 text-center font-bold ${sub.grade === "—" ? "text-ulead-line" : gradeColor[sub.grade]}`}>{sub.grade}</td>
            <td className={`px-4 py-3 text-center text-xs ${sub.grade === "—" ? "text-ulead-line" : gradeColor[sub.grade]}`}>{sub.remark}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

          <div className="mb-5 space-y-4 rounded-2xl border border-ulead-line bg-chalk-card p-5">
            <div>
              <h4 className="mb-1 font-serif text-sm font-semibold text-ink">Class Teacher's Comment</h4>
              <p className="text-sm text-ulead-slate">Results have been released. Contact the class teacher for further comments.</p>
            </div>
            <div className="border-t border-ulead-line pt-4">
              <h4 className="mb-1 font-serif text-sm font-semibold text-ink">Principal's Comment</h4>
              <p className="text-sm text-ulead-slate">Keep up the good work and continue striving for excellence.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-ulead-line bg-chalk-card p-5 print:hidden">
            <h4 className="mb-3 font-serif text-sm font-semibold text-ink">Grading Key</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              {[{ g: "A", r: "70%+", l: "Excellent" }, { g: "B", r: "60–69%", l: "Very Good" }, { g: "C", r: "50–59%", l: "Good" }, { g: "D", r: "45–49%", l: "Fair" }, { g: "F", r: "Below 45%", l: "Fail" }].map((x) => (
                <div key={x.g} className="flex items-center gap-2">
                  <span className={`text-base font-bold ${gradeColor[x.g]}`}>{x.g}</span>
                  <span className="text-ulead-slate">— {x.r} ({x.l})</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Field({ label, value, mono, bold, className }: { label: string; value: string; mono?: boolean; bold?: boolean; className?: string }) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wide text-ulead-slate">{label}</p>
      <p className={`text-sm ${bold ? "font-bold" : "font-medium"} ${mono ? "font-mono" : ""} ${className ?? "text-ink"}`}>{value}</p>
    </div>
  );
}