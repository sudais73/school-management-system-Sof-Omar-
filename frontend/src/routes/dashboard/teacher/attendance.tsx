import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, Users, Check } from "lucide-react";
import { fetchMyClasses } from "@/features/grades/services/grades.api";
import { fetchAttendance, saveAttendance } from "@/features/attendance/services/attendance.api";
import type { TeacherClass } from "@/types/grade";
import type { AttendanceStatus } from "@/types/attendance";

export const Route = createFileRoute("/dashboard/teacher/attendance")({
  component: AttendancePage,
});

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; active: string }[] = [
  { value: "PRESENT", label: "Present", active: "bg-evergreen text-white" },
  { value: "ABSENT", label: "Absent", active: "bg-red-500 text-white" },
  { value: "LATE", label: "Late", active: "bg-marigold text-ink" },
  { value: "EXCUSED", label: "Excused", active: "bg-ink text-white" },
];

const todayStr = () => new Date().toISOString().split("T")[0];

function isDateEditable(dateStr: string) {
  const selected = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - selected.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
}

function AttendancePage() {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(todayStr());
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedClass = classes.find((c) => c.id === classId) ?? null;
  const editable = isDateEditable(date);

  useEffect(() => {
    fetchMyClasses().then((cls) => {
      setClasses(cls);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!classId || !date) return;
    setFetching(true);
    fetchAttendance(classId, date)
      .then((res) => {
        setStatusMap(res.statusMap);
        setIsEditMode(res.isEdit);
      })
      .finally(() => setFetching(false));
  }, [classId, date]);

  function handleClassChange(id: string) {
    setClassId(id);
    setStatusMap({});
    setIsEditMode(false);
  }

  function handleStatusChange(studentId: string, status: AttendanceStatus) {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  }

  const allPresent = !!selectedClass && selectedClass.students.length > 0 && selectedClass.students.every((s) => statusMap[s.id] === "PRESENT");

  function handleCheckAllPresent() {
    if (!selectedClass) return;
    if (allPresent) {
      setStatusMap({});
    } else {
      const next: Record<string, AttendanceStatus> = {};
      selectedClass.students.forEach((s) => { next[s.id] = "PRESENT"; });
      setStatusMap(next);
    }
  }

  const counts = {
    PRESENT: Object.values(statusMap).filter((s) => s === "PRESENT").length,
    ABSENT: Object.values(statusMap).filter((s) => s === "ABSENT").length,
    LATE: Object.values(statusMap).filter((s) => s === "LATE").length,
    EXCUSED: Object.values(statusMap).filter((s) => s === "EXCUSED").length,
  };
  const unmarkedCount = selectedClass ? selectedClass.students.length - Object.keys(statusMap).length : 0;

  async function handleSubmit() {
    if (!selectedClass) return;
    if (unmarkedCount > 0 && !confirm(`${unmarkedCount} student(s) not marked — they'll default to Absent. Continue?`)) return;

    setSubmitting(true);
    setError(null);
    try {
      const records = selectedClass.students.map((s) => ({ studentId: s.id, status: statusMap[s.id] ?? "ABSENT" as AttendanceStatus }));
      const result = await saveAttendance(classId, date, records);
      setIsEditMode(result.isEdit);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-evergreen" size={28} /></div>;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Attendance</h1>
          <p className="mt-0.5 text-sm text-ulead-slate">Mark daily attendance for your classes</p>
        </div>
        {isEditMode && (
          <span className="flex items-center gap-2 rounded-full border border-ink/10 bg-ink/5 px-3 py-1.5 text-xs font-semibold text-ink">
            <CheckCircle size={13} /> Editing existing attendance
          </span>
        )}
      </div>

      <div className="mb-5 rounded-2xl border border-ulead-line bg-chalk-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ulead-slate">Select class</label>
            <select value={classId} onChange={(e) => handleClassChange(e.target.value)} className="w-full rounded-xl border border-ulead-line px-4 py-2.5 text-sm outline-none focus:border-evergreen">
              <option value="">Choose a class...</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.className}</option>)}
            </select>
          </div>
          <div className="sm:w-48">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ulead-slate">Date</label>
            <input type="date" value={date} max={todayStr()} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-ulead-line px-4 py-2.5 text-sm outline-none focus:border-evergreen" />
          </div>
        </div>
        {date && !editable && (
          <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            Cannot edit attendance older than 7 days.
          </div>
        )}
      </div>

      {selectedClass && Object.keys(statusMap).length > 0 && (
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATUS_OPTIONS.map((opt) => (
            <div key={opt.value} className="rounded-xl border border-ulead-line bg-chalk-card p-3 text-center">
              <p className="text-2xl font-bold text-ink">{counts[opt.value]}</p>
              <p className="mt-0.5 text-xs text-ulead-slate">{opt.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-ulead-line bg-chalk-card">
        {!selectedClass ? (
          <div className="py-20 text-center text-ulead-slate">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Select a class to start</p>
          </div>
        ) : fetching ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-evergreen" size={24} /></div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ulead-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-ulead-slate" />
                <span className="text-sm font-semibold text-ink">{selectedClass.className}</span>
                <span className="text-xs text-ulead-slate">· {selectedClass.students.length} students</span>
              </div>
              <button onClick={handleCheckAllPresent} className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition ${allPresent ? "border-evergreen bg-evergreen text-white" : "border-evergreen/30 bg-evergreen/10 text-evergreen-deep hover:bg-evergreen/20"}`}>
                <div className={`flex h-4 w-4 items-center justify-center rounded border ${allPresent ? "border-white bg-white" : "border-evergreen/50 bg-white"}`}>
                  {allPresent && <Check size={12} className="text-evergreen-deep" />}
                </div>
                {allPresent ? "All Present (click to clear)" : "Mark All Present"}
              </button>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-ulead-line sm:hidden">
              {selectedClass.students.map((student) => {
                const status = statusMap[student.id];
                return (
                  <div key={student.id} className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${student.gender === "MALE" ? "bg-ink/10 text-ink" : "bg-marigold/15 text-marigold-deep"}`}>
                          {student.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">{student.firstName} {student.lastName}</p>
                          <p className="font-mono text-xs text-ulead-slate">{student.admissionNumber}</p>
                        </div>
                      </div>
                      {status && <span className="rounded-full bg-chalk px-2.5 py-1 text-xs font-semibold text-ink">{status}</span>}
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {STATUS_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => handleStatusChange(student.id, opt.value)} disabled={!editable}
                          className={`rounded-xl py-2 text-xs font-semibold transition ${status === opt.value ? opt.active : "bg-chalk text-ulead-slate hover:bg-white"} disabled:cursor-not-allowed disabled:opacity-40`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop */}
            <div className="hidden divide-y divide-ulead-line sm:block">
              {selectedClass.students.map((student) => {
                const status = statusMap[student.id];
                return (
                  <div key={student.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${student.gender === "MALE" ? "bg-ink/10 text-ink" : "bg-marigold/15 text-marigold-deep"}`}>
                        {student.firstName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{student.firstName} {student.lastName}</p>
                        <p className="font-mono text-xs text-ulead-slate">{student.admissionNumber}</p>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-1.5">
                      {STATUS_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => handleStatusChange(student.id, opt.value)} disabled={!editable}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${status === opt.value ? opt.active : "bg-chalk text-ulead-slate hover:bg-white"} disabled:cursor-not-allowed disabled:opacity-40`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedClass.students.length === 0 && (
              <div className="py-12 text-center text-sm text-ulead-slate">No students in this class</div>
            )}
          </>
        )}
      </div>

      {selectedClass && editable && (
        <div className="mt-5 pb-6">
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <button onClick={handleSubmit} disabled={submitting || selectedClass.students.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-evergreen py-3.5 text-sm font-semibold text-white transition hover:bg-evergreen-deep disabled:cursor-not-allowed disabled:opacity-40">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Saving..." : isEditMode ? "Update Attendance" : "Submit Attendance"}
          </button>
          {unmarkedCount > 0 && (
            <p className="mt-2 text-center text-xs text-marigold-deep">
              {unmarkedCount} student{unmarkedCount > 1 ? "s" : ""} not marked — will default to Absent
            </p>
          )}
        </div>
      )}
    </div>
  );
}