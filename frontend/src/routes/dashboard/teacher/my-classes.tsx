import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Check, Loader2, Send, Save } from "lucide-react";
import { fetchMyClasses, fetchStructure, createStructure, fetchMarks, saveMarks } from "@/features/grades/services/grades.api";
import { gradeFor, remarkFor, gradeBadgeClass } from "@/features/grades/grade-helpers";
import { SESSIONS, TERMS } from "@/lib/academic-constants";
import type { TeacherClass, GradeStructure } from "@/types/grade";
import { StudentScoreCard } from "#/features/grades/components/StudentScoreCard";

export const Route = createFileRoute("/dashboard/teacher/my-classes")({
  component: MyClassesPage,
});

function MyClassesPage() {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [term, setTerm] = useState(TERMS[0]);
  const [session, setSession] = useState(SESSIONS[0]);

  const [structure, setStructure] = useState<GradeStructure | null>(null);
  const [loadingStructure, setLoadingStructure] = useState(false);

  const [numTests, setNumTests] = useState(2);
  const [testMaxes, setTestMaxes] = useState([20, 20, 15]);
  const [examMax, setExamMax] = useState(60);
  const [savingStructure, setSavingStructure] = useState(false);
  const [structureError, setStructureError] = useState<string | null>(null);

  const [scoreMap, setScoreMap] = useState<Record<string, Record<string, number>>>({});
  const [savingDraft, setSavingDraft] = useState(false);
  const [releasing, setReleasing] = useState("");
  const [editingComponents, setEditingComponents] = useState<Set<string>>(new Set());
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const selectedClass = useMemo(() => classes.find((c) => c.id === classId) ?? null, [classes, classId]);
  const selectedSubject = useMemo(() => selectedClass?.subjects.find((s) => s.id === subjectId) ?? null, [selectedClass, subjectId]);
  const students = selectedClass?.students ?? [];

  const activeTestMaxes = testMaxes.slice(0, numTests);
  const totalMarkSum = activeTestMaxes.reduce((a, v) => a + v, 0) + examMax;
  const grandMax = structure ? structure.components.reduce((a, c) => a + c.maxScore, 0) : 0;

  useEffect(() => {
    fetchMyClasses().then((cls) => {
      setClasses(cls);
      if (cls.length > 0) {
        setClassId(cls[0].id);
        if (cls[0].subjects.length > 0) setSubjectId(cls[0].subjects[0].id);
      }
      setLoadingClasses(false);
    });
  }, []);

  useEffect(() => {
    if (!classId || !subjectId) return;
    setLoadingStructure(true);
    setStructure(null);
    setScoreMap({});
    fetchStructure(classId, subjectId, term, session)
      .then(async (s) => {
        setStructure(s);
        if (s) {
          const entries = await Promise.all(s.components.map((c) => fetchMarks(c.id).then((marks) => [c.id, marks] as const)));
          const map: Record<string, Record<string, number>> = {};
          entries.forEach(([componentId, marks]) => {
            marks.forEach((m) => {
              if (!map[m.studentId]) map[m.studentId] = {};
              map[m.studentId][componentId] = m.score;
            });
          });
          setScoreMap(map);
        }
      })
      .finally(() => setLoadingStructure(false));
  }, [classId, subjectId, term, session]);

  function handleClassChange(id: string) {
    setClassId(id);
    const cls = classes.find((c) => c.id === id);
    setSubjectId(cls?.subjects[0]?.id ?? "");
  }

  async function handleSaveStructure() {
    setStructureError(null);
    const components = [
      ...activeTestMaxes.map((max, i) => ({ name: numTests === 1 ? "Test" : `Test ${i + 1}`, maxScore: max })),
      { name: "Exam", maxScore: examMax },
    ];
    const title = `${selectedSubject?.name} \u2013 ${term} ${session}`;

    setSavingStructure(true);
    try {
      const s = await createStructure({ classId, subjectId, title, term, session, components });
      setStructure(s);
    } catch (err: any) {
      setStructureError(err.response?.data?.message ?? "Failed to save structure");
    } finally {
      setSavingStructure(false);
    }
  }

  function handleScoreChange(studentId: string, componentId: string, value: number, maxScore: number) {
    const clamped = Math.min(Math.max(0, value), maxScore);
    setScoreMap((prev) => ({ ...prev, [studentId]: { ...(prev[studentId] || {}), [componentId]: clamped } }));
  }

  function buildMarksPayload(componentId: string) {
    return students.map((s) => ({ studentId: s.id, score: scoreMap[s.id]?.[componentId] ?? 0 }));
  }

  async function handleSaveDraft() {
    if (!structure) return;
    const componentsToSave = structure.components.filter((c) => students.some((s) => scoreMap[s.id]?.[c.id] !== undefined));
    if (componentsToSave.length === 0) return;

    setSavingDraft(true);
    try {
      await Promise.all(componentsToSave.map((c) => saveMarks(c.id, buildMarksPayload(c.id), "draft")));
      setBanner({ type: "success", text: "Scores saved as draft." });
    } catch {
      setBanner({ type: "error", text: "Failed to save scores." });
    } finally {
      setSavingDraft(false);
    }
  }

  async function handleRelease(componentId: string, name: string) {
    setReleasing(componentId);
    try {
      await saveMarks(componentId, buildMarksPayload(componentId), "release");
      setStructure((prev) => prev ? { ...prev, components: prev.components.map((c) => c.id === componentId ? { ...c, status: "PUBLISHED" } : c) } : null);
      setEditingComponents((prev) => { const next = new Set(prev); next.delete(componentId); return next; });
      setBanner({ type: "success", text: `${name} released \u2014 students can now see their scores.` });
    } catch (err: any) {
      setBanner({ type: "error", text: err.response?.data?.message ?? "Failed to release" });
    } finally {
      setReleasing("");
    }
  }

  function getStudentTotal(studentId: string) {
    if (!structure) return 0;
    return structure.components.reduce((sum, c) => sum + (scoreMap[studentId]?.[c.id] || 0), 0);
  }

  if (loadingClasses) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-evergreen" size={28} /></div>;
  }

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-semibold text-ink">Record Exam & Test Scores</h1>
      <p className="mb-6 text-sm text-ulead-slate">Select your class and subject, define the grade structure, then enter scores.</p>

      {banner && (
        <div className={`mb-4 rounded-lg px-3 py-2 text-sm ${banner.type === "success" ? "bg-evergreen/10 text-evergreen-deep" : "bg-red-50 text-red-600"}`}>
          {banner.text}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-ulead-line bg-chalk-card p-5 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ulead-slate">Class</label>
          <select value={classId} onChange={(e) => handleClassChange(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen">
            {classes.map((c) => <option key={c.id} value={c.id}>{c.className}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ulead-slate">Subject</label>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen">
            {selectedClass?.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ulead-slate">Session</label>
          <select value={session} onChange={(e) => setSession(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen">
            {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ulead-slate">Semester</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen">
            {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {loadingStructure && (
        <div className="flex items-center justify-center py-12 text-sm text-ulead-slate">
          <Loader2 className="mr-2 animate-spin" size={18} /> Loading grade structure...
        </div>
      )}

      {!loadingStructure && classId && subjectId && !structure && (
        <div className="mb-6 rounded-2xl border border-ulead-line bg-chalk-card p-6">
          <div className="mb-5 rounded-xl border border-marigold/30 bg-marigold/10 p-4 text-sm text-marigold-deep">
            No grade structure found for {selectedSubject?.name} \u2014 {term} {session}. Define it below.
          </div>

          <h3 className="mb-3 font-serif text-base font-semibold text-ink">How many tests before the exam?</h3>
          <div className="mb-4 flex flex-wrap gap-2">
            {[1, 2, 3].map((n) => (
              <button key={n} onClick={() => setNumTests(n)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${numTests === n ? "border border-evergreen bg-evergreen/10 text-evergreen-deep" : "border border-transparent bg-chalk text-ulead-slate hover:bg-white"}`}>
                {n} Test{n > 1 ? "s" : ""}
              </button>
            ))}
          </div>

          <div className="mb-5 flex flex-wrap gap-4">
            {Array.from({ length: numTests }).map((_, i) => (
              <div key={i} className="w-24">
                <label className="mb-1 block text-xs font-semibold text-ulead-slate">Test {i + 1} max</label>
                <input type="number" value={testMaxes[i]} onChange={(e) => { const next = [...testMaxes]; next[i] = parseInt(e.target.value) || 0; setTestMaxes(next); }} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-center text-sm outline-none focus:border-evergreen" />
              </div>
            ))}
            <div className="w-24">
              <label className="mb-1 block text-xs font-semibold text-ulead-slate">Exam max</label>
              <input type="number" value={examMax} onChange={(e) => setExamMax(parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-center text-sm outline-none focus:border-evergreen" />
            </div>
          </div>

          <div className={`mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${totalMarkSum === 100 ? "bg-evergreen/10 text-evergreen-deep" : "bg-marigold/15 text-marigold-deep"}`}>
            {totalMarkSum === 100 ? (<><Check size={15} /> Marks add up to 100</>) : (<>Total is {totalMarkSum} \u2014 adjust so it adds up to 100</>)}
          </div>

          {structureError && <p className="mb-4 text-sm text-red-600">{structureError}</p>}

          <button onClick={handleSaveStructure} disabled={savingStructure || totalMarkSum !== 100} className="flex items-center gap-2 rounded-xl bg-evergreen px-5 py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep disabled:opacity-50">
            {savingStructure ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Grade Structure
          </button>
        </div>
      )}

      {!loadingStructure && structure && (
        <div className="mb-6 rounded-2xl border border-ulead-line bg-chalk-card p-5">
          <div className="mb-4">
            <h3 className="font-serif text-sm font-semibold text-ink">{structure.title}</h3>
            <p className="text-xs text-ulead-slate">{selectedClass?.className} \u00b7 {selectedSubject?.name} \u00b7 {term} {session}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {structure.components.map((comp) => {
              const isEditing = editingComponents.has(comp.id);
              return (
                <div key={comp.id} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${isEditing ? "border-marigold/40 bg-marigold/10" : "border-ulead-line"}`}>
                  <div>
                    <p className="text-xs font-semibold text-ink">{comp.name} <span className="font-normal text-ulead-slate">/{comp.maxScore}</span></p>
                    <p className="mt-0.5 text-xs">
                      {comp.status === "PUBLISHED" ? (isEditing ? <span className="font-semibold text-marigold-deep">Editing</span> : <span className="font-semibold text-evergreen-deep">Released</span>) : <span className="text-ulead-slate">Draft</span>}
                    </p>
                  </div>
                  <div className="ml-1 flex gap-1">
                    {comp.status === "PUBLISHED" && !isEditing && (
                      <button onClick={() => setEditingComponents((prev) => new Set(prev).add(comp.id))} className="rounded-lg bg-marigold px-3 py-1 text-xs font-semibold text-ink hover:bg-marigold-deep hover:text-white">Edit</button>
                    )}
                    {comp.status === "PUBLISHED" && isEditing && (
                      <>
                        <button onClick={() => handleRelease(comp.id, comp.name)} disabled={savingDraft} className="rounded-lg bg-evergreen px-3 py-1 text-xs font-semibold text-white hover:bg-evergreen-deep disabled:opacity-50">Save</button>
                        <button onClick={() => setEditingComponents((prev) => { const n = new Set(prev); n.delete(comp.id); return n; })} className="rounded-lg bg-chalk px-3 py-1 text-xs font-semibold text-ulead-slate hover:bg-white">Cancel</button>
                      </>
                    )}
                    {comp.status !== "PUBLISHED" && (
                      <button onClick={() => handleRelease(comp.id, comp.name)} disabled={releasing === comp.id} className="flex items-center gap-1 rounded-lg bg-evergreen px-3 py-1 text-xs font-semibold text-white hover:bg-evergreen-deep disabled:opacity-50">
                        {releasing === comp.id ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Release
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 border-t border-dashed border-ulead-line pt-3 text-xs text-ulead-slate">
            <span>Total: <b className="text-ink">{grandMax}</b></span>
            <span>Grading \u2014 A: 70%+ \u00b7 B: 60\u201369% \u00b7 C: 50\u201359% \u00b7 D: 45\u201349% \u00b7 F: below 45%</span>
          </div>
        </div>
      )}


      {!loadingStructure && structure && students.length > 0 && (
          <>
    {/* Mobile */}
    <div className="mb-5 grid grid-cols-1 gap-3 md:hidden">
      {students.map((student) => (
        <StudentScoreCard
          key={student.id}
          student={student}
          components={structure.components}
          scores={scoreMap[student.id] ?? {}}
          editingComponents={editingComponents}
          grandMax={grandMax}
          onScoreChange={handleScoreChange}
        />
      ))}
      <button
        onClick={handleSaveDraft}
        disabled={savingDraft}
        className="flex items-center justify-center gap-2 rounded-xl border border-ulead-line bg-chalk-card py-3 text-sm font-semibold text-ink hover:bg-chalk disabled:opacity-50"
      >
        {savingDraft ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save as Draft
      </button>
    </div>
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-ulead-line bg-chalk-card p-5">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ulead-line">
                <th className="px-3 py-2 text-left text-xs font-semibold text-ulead-slate">Student</th>
                {structure.components.map((comp) => (
                  <th key={comp.id} className="px-3 py-2 text-left text-xs font-semibold text-ulead-slate">
                    {comp.name} <span className="font-normal">/{comp.maxScore}</span>
                    {comp.status === "PUBLISHED" && <div className="text-[10px] font-semibold text-evergreen-deep">Released</div>}
                  </th>
                ))}
                <th className="px-3 py-2 text-left text-xs font-semibold text-ulead-slate">Total</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-ulead-slate">Grade</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-ulead-slate">Remark</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const total = getStudentTotal(student.id);
                const hasAny = structure.components.some((c) => scoreMap[student.id]?.[c.id] !== undefined);
                const grade = hasAny ? gradeFor(total, grandMax) : "";

                return (
                  <tr key={student.id} className="border-b border-ulead-line hover:bg-chalk">
                    <td className="px-3 py-3">
                      <p className="text-sm font-semibold text-ink">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-ulead-slate">{student.admissionNumber}</p>
                    </td>
                    {structure.components.map((comp) => {
                      const score = scoreMap[student.id]?.[comp.id];
                      const isReleased = comp.status === "PUBLISHED";
                      const isEditing = editingComponents.has(comp.id);
                      const showInput = !isReleased || isEditing;
                      return (
                        <td key={comp.id} className="px-3 py-3">
                          {showInput ? (
                            <input type="number" min={0} max={comp.maxScore} value={score ?? ""} placeholder="\u2014"
                              onChange={(e) => handleScoreChange(student.id, comp.id, parseInt(e.target.value) || 0, comp.maxScore)}
                              className={`w-14 rounded-lg border px-2 py-1 text-center text-sm outline-none ${isEditing ? "border-marigold bg-marigold/10" : "border-ulead-line"}`} />
                          ) : (
                            <span className="inline-block w-14 rounded-lg bg-evergreen/10 px-2 py-1 text-center text-sm font-semibold text-evergreen-deep">{score ?? "\u2014"}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-3 font-bold text-ink">{hasAny ? total : "\u2014"}</td>
                    <td className="px-3 py-3">{grade ? <span className={`rounded-full px-3 py-1 text-xs font-bold ${gradeBadgeClass(grade)}`}>{grade}</span> : "\u2014"}</td>
                    <td className="px-3 py-3 text-xs text-ulead-slate">{grade ? remarkFor(grade) : "Not yet scored"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-5 flex flex-col gap-3 border-t border-ulead-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button onClick={handleSaveDraft} disabled={savingDraft} className="flex items-center justify-center gap-2 rounded-lg border border-ulead-line px-4 py-2 text-sm font-semibold text-ink hover:bg-chalk disabled:opacity-50">
              {savingDraft ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save as Draft
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}