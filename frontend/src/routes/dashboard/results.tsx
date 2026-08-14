import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Loader2, ChevronDown, ChevronUp, Users } from "lucide-react";
import { fetchClasses } from "@/features/classes/services/classes.api";
import { fetchClassResults } from "@/features/results/services/results.api";
import { SESSIONS, TERMS } from "@/lib/academic-constants";
import { gradeBadgeClass } from "@/features/grades/grade-helpers";
import type { SchoolClass } from "@/types/class";
import type { ClassResults, StudentResult } from "@/types/result";

export const Route = createFileRoute("/dashboard/results")({
  component: AdminResultsPage,
});

const fullName = (s: StudentResult) => [s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ");
const initials = (s: StudentResult) => `${s.firstName?.[0] ?? ""}${s.lastName?.[0] ?? ""}`.toUpperCase();

const gradeRowBg: Record<string, string> = {
  A: "bg-evergreen/[0.04]", B: "bg-ink/[0.03]", C: "bg-marigold/[0.06]", D: "bg-red-50/40", F: "bg-red-50/40",
};

function AdminResultsPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [classId, setClassId] = useState("");
  const [session, setSession] = useState(SESSIONS[0]);
  const [term, setTerm] = useState(TERMS[0]);

  const [result, setResult] = useState<ClassResults | null>(null);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingResult, setLoadingResult] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClasses().then((cls) => {
      setClasses(cls);
      if (cls.length > 0) setClassId(cls[0].id);
      setLoadingClasses(false);
    });
  }, []);

  useEffect(() => {
    if (!classId) return;
    setLoadingResult(true);
    setResult(null);
    setError("");
    setExpandedId(null);
    setSearch("");

    fetchClassResults(classId, session, term)
      .then(setResult)
      .catch((err) => setError(err.response?.data?.message ?? "Failed to load results"))
      .finally(() => setLoadingResult(false));
  }, [classId, session, term]);

  const filtered = useMemo(() => {
    if (!result) return [];
    if (!search.trim()) return result.students;
    const q = search.toLowerCase();
    return result.students.filter((s) => fullName(s).toLowerCase().includes(q) || s.admissionNumber.toLowerCase().includes(q));
  }, [result, search]);

  const summary = useMemo(() => {
    if (!result?.students.length) return null;
    const scored = result.students.filter((s) => s.summary.totalSubjects > 0);
    const avgScore = scored.length ? Math.round(scored.reduce((sum, s) => sum + s.summary.avgScore, 0) / scored.length) : 0;
    const gradeCounts: Record<string, number> = {};
    scored.forEach((s) => { gradeCounts[s.summary.overallGrade] = (gradeCounts[s.summary.overallGrade] ?? 0) + 1; });
    return { avgScore, gradeCounts, total: result.students.length };
  }, [result]);

  if (loadingClasses) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-evergreen" size={28} /></div>;

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-semibold text-ink">Class Results</h1>
      <p className="mb-6 text-sm text-ulead-slate">View student results by class, session, and semester</p>

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

      {loadingResult && (
        <div className="flex items-center justify-center rounded-2xl border border-ulead-line bg-chalk-card p-16">
          <Loader2 className="mr-2 animate-spin text-evergreen" size={20} /> <span className="text-sm text-ulead-slate">Loading results...</span>
        </div>
      )}

      {!loadingResult && error && (
        <div className="rounded-2xl border border-ulead-line bg-chalk-card p-16 text-center">
          <Users size={40} className="mx-auto mb-3 text-ulead-line" />
          <p className="font-medium text-ulead-slate">{error}</p>
        </div>
      )}

      {!loadingResult && result && (
        <>
          {summary && (
            <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-ulead-line bg-chalk-card p-4 text-center">
                <p className="text-2xl font-bold text-ink">{summary.total}</p>
                <p className="mt-1 text-xs text-ulead-slate">Total students</p>
              </div>
              <div className="rounded-xl border border-evergreen/20 bg-evergreen/10 p-4 text-center">
                <p className="text-2xl font-bold text-evergreen-deep">{summary.avgScore}%</p>
                <p className="mt-1 text-xs text-ulead-slate">Class average</p>
              </div>
              <div className="rounded-xl border border-ink/10 bg-ink/5 p-4 text-center">
                <p className="text-2xl font-bold text-ink">{summary.gradeCounts["A"] ?? 0}</p>
                <p className="mt-1 text-xs text-ulead-slate">A grade students</p>
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{summary.gradeCounts["F"] ?? 0}</p>
                <p className="mt-1 text-xs text-ulead-slate">Need support (F)</p>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-ulead-line bg-chalk-card">
            <div className="flex flex-col items-start justify-between gap-3 border-b border-ulead-line p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-ulead-slate" />
                <span className="text-sm font-semibold text-ink">{filtered.length} of {result.students.length} students</span>
              </div>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or admission number..." className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen sm:w-64" />
            </div>

            {/* Mobile */}
            <div className="space-y-3 p-4 md:hidden">
              {filtered.map((student) => (
                <div key={student.id} className="overflow-hidden rounded-2xl border border-ulead-line bg-white">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${student.gender === "MALE" ? "bg-ink/10 text-ink" : "bg-marigold/15 text-marigold-deep"}`}>{initials(student)}</div>
                        <div>
                          <p className="text-sm font-semibold text-ink">{fullName(student)}</p>
                          <p className="font-mono text-xs text-ulead-slate">{student.admissionNumber}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${gradeBadgeClass(student.summary.overallGrade)}`}>{student.summary.overallGrade}</span>
                        <span className="text-xs text-ulead-slate">{student.summary.avgScore}% avg</span>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-ulead-line border-t border-ulead-line">
                    {student.subjects.map((sub) => (
                      <div key={sub.subjectName} className="flex items-center justify-between px-4 py-2.5">
                        <p className="text-xs uppercase tracking-wide text-ulead-slate">{sub.subjectName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-ink">{sub.total}/{sub.grandMax}</span>
                          <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${gradeBadgeClass(sub.grade)}`}>{sub.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-ulead-line p-3">
                    <button onClick={() => setExpandedId(expandedId === student.id ? null : student.id)} className="flex w-full items-center justify-center gap-1 rounded-xl bg-evergreen/10 py-2 text-xs font-semibold text-evergreen-deep hover:bg-evergreen/20">
                      {expandedId === student.id ? <><ChevronUp size={14} /> Hide detail</> : <><ChevronDown size={14} /> View component breakdown</>}
                    </button>
                    {expandedId === student.id && (
                      <div className="mt-3 space-y-3">
                        {student.subjects.map((sub) => (
                          <div key={sub.subjectName} className="rounded-xl bg-chalk p-3">
                            <p className="mb-2 text-xs font-bold text-ink">{sub.subjectName}</p>
                            {sub.components.map((c) => (
                              <div key={c.name} className="flex justify-between text-xs">
                                <span className="text-ulead-slate">{c.name} (/{c.maxScore})</span>
                                <span className="font-semibold text-ink">{c.score ?? "—"}</span>
                              </div>
                            ))}
                            <div className="mt-1 flex justify-between border-t border-ulead-line pt-1 text-xs">
                              <span className="font-semibold text-ink">Total</span>
                              <span className={`font-bold ${gradeBadgeClass(sub.grade)}`}>{sub.total}/{sub.grandMax} — {sub.grade}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ulead-line bg-chalk">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ulead-slate">Student</th>
                    {result.students[0]?.subjects.map((sub) => (
                      <th key={sub.subjectName} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ulead-slate">
                        {sub.subjectName}<div className="text-[10px] font-normal normal-case text-ulead-slate/70">/{sub.grandMax}</div>
                      </th>
                    ))}
                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ulead-slate">Avg</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ulead-slate">Grade</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ulead-slate">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ulead-line">
                  {filtered.map((student) => (
                    <>
                      <tr key={student.id} className={`hover:bg-chalk/60 ${gradeRowBg[student.summary.overallGrade] ?? ""}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${student.gender === "MALE" ? "bg-ink/10 text-ink" : "bg-marigold/15 text-marigold-deep"}`}>{initials(student)}</div>
                            <div>
                              <p className="text-sm font-medium text-ink">{fullName(student)}</p>
                              <p className="font-mono text-xs text-ulead-slate">{student.admissionNumber}</p>
                            </div>
                          </div>
                        </td>
                        {student.subjects.map((sub) => (
                          <td key={sub.subjectName} className="px-3 py-3 text-center">
                            <span className="font-semibold text-ink">{sub.total}</span>
                            <span className={`ml-1 text-xs font-semibold ${gradeBadgeClass(sub.grade)}`}>{sub.grade}</span>
                          </td>
                        ))}
                        <td className="px-3 py-3 text-center font-bold text-ink">{student.summary.avgScore}%</td>
                        <td className="px-3 py-3 text-center"><span className={`rounded-full px-2 py-0.5 font-bold ${gradeBadgeClass(student.summary.overallGrade)}`}>{student.summary.overallGrade}</span></td>
                        <td className="px-3 py-3 text-center">
                          <button onClick={() => setExpandedId(expandedId === student.id ? null : student.id)} className="rounded-lg p-1.5 text-ulead-slate hover:bg-chalk">
                            {expandedId === student.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>
                      {expandedId === student.id && (
                        <tr>
                          <td colSpan={student.subjects.length + 4} className="border-b border-ulead-line bg-chalk px-5 py-4">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ulead-slate">{fullName(student)} — Subject Breakdown</p>
                            <div className="overflow-x-auto rounded-lg border border-ulead-line">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-ulead-line bg-white">
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-ulead-slate">Subject</th>
                                    {student.subjects[0]?.components.map((c) => (
                                      <th key={c.name} className="px-4 py-2 text-center text-xs font-semibold text-ulead-slate">{c.name}<span className="ml-1 font-normal text-ulead-slate/70">/{c.maxScore}</span></th>
                                    ))}
                                    <th className="px-4 py-2 text-center text-xs font-semibold text-ulead-slate">Total</th>
                                    <th className="px-4 py-2 text-center text-xs font-semibold text-ulead-slate">Grade</th>
                                    <th className="px-4 py-2 text-center text-xs font-semibold text-ulead-slate">Remark</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-ulead-line">
                                  {student.subjects.map((sub) => (
                                    <tr key={sub.subjectName} className="bg-white hover:bg-chalk">
                                      <td className="px-4 py-2 font-medium text-ink">{sub.subjectName}</td>
                                      {sub.components.map((c) => <td key={c.name} className="px-4 py-2 text-center text-ulead-slate">{c.score ?? "—"}</td>)}
                                      <td className="px-4 py-2 text-center font-bold text-ink">{sub.total}<span className="ml-1 text-xs font-normal text-ulead-slate">/{sub.grandMax}</span></td>
                                      <td className={`px-4 py-2 text-center font-bold ${gradeBadgeClass(sub.grade)}`}>{sub.grade}</td>
                                      <td className="px-4 py-2 text-center text-xs text-ulead-slate">{sub.remark}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && <div className="py-12 text-center text-sm text-ulead-slate">No students match your search</div>}
          </div>
        </>
      )}
    </div>
  );
}