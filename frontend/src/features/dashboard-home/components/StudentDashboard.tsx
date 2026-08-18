import { useEffect, useState } from "react";
import { BookOpen, TrendingUp } from "lucide-react";
import { fetchMySubjects, fetchMyResult } from "../services/dashboard.api";
import { SESSIONS, TERMS } from "@/lib/academic-constants";
import { gradeColor, scoreColor } from "@/features/results-shared/grade-display";
import type { ChildResult } from "@/types/parent-result";

export function StudentDashboard() {
  const [subjects, setSubjects] = useState<{ id: string; name: string; teacherName: string | null }[]>([]);
  const [result, setResult] = useState<ChildResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchMySubjects(),
      fetchMyResult(SESSIONS[0], TERMS[0]).catch(() => null),
    ]).then(([subs, res]) => {
      setSubjects(subs);
      setResult(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-chalk-card" />)}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-semibold text-ink">Welcome back</h1>
      <p className="mb-6 text-sm text-ulead-slate">Here's your subjects and latest result.</p>

      <div className="mb-5 rounded-2xl border border-ulead-line bg-chalk-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-evergreen-deep" />
          <p className="text-sm font-semibold text-ink">My Subjects</p>
        </div>
        {subjects.length === 0 ? (
          <p className="text-sm text-ulead-slate">No subjects assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {subjects.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg bg-chalk px-3 py-2.5">
                <span className="text-sm font-medium text-ink">{s.name}</span>
                <span className="text-xs text-ulead-slate">{s.teacherName ?? "Unassigned"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-marigold-deep" />
          <p className="text-sm font-semibold text-ink">Latest Result — {TERMS[0]}, {SESSIONS[0]}</p>
        </div>

        {!result ? (
          <p className="text-sm text-ulead-slate">No results released for this term yet.</p>
        ) : (
          <>
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MiniStat label="Average" value={`${result.summary.avgScore}%`} />
              <MiniStat label="Subjects" value={String(result.summary.totalSubjects)} />
              <MiniStat label="Rank" value={result.summary.rank ? `${result.summary.rank} of ${result.summary.outOf}` : "—"} />
              <MiniStat label="Grade" value={result.summary.overallGrade} />
            </div>

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
          </>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-chalk p-3 text-center">
      <p className="font-mono text-lg font-bold text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-ulead-slate">{label}</p>
    </div>
  );
}