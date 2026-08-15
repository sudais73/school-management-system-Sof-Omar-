import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, Users, Eye, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { fetchDailyOverview, fetchClassAttendance, fetchStudentHistory, searchStudents } from "@/features/admin-attendance/services/admin-attendance.api";
import type { DailySummary, ClassAttendanceRow, StudentAttendanceRecord, StudentHistorySummary, StudentHistoryRecord } from "@/types/admin-attendance";

export const Route = createFileRoute("/dashboard/attendance/overview")({
  component: AdminAttendancePage,
});

const todayStr = () => new Date().toISOString().split("T")[0];

const statusStyle: Record<string, string> = {
  PRESENT: "bg-evergreen/10 text-evergreen-deep",
  ABSENT: "bg-red-100 text-red-600",
  LATE: "bg-marigold/15 text-marigold-deep",
  EXCUSED: "bg-ink/10 text-ink",
};

function AdminAttendancePage() {
  const [date, setDate] = useState(todayStr());
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [classes, setClasses] = useState<ClassAttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalClass, setModalClass] = useState<ClassAttendanceRow | null>(null);
  const [modalRecords, setModalRecords] = useState<StudentAttendanceRecord[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  const [studentSearch, setStudentSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [studentSummary, setStudentSummary] = useState<StudentHistorySummary | null>(null);
  const [studentRecords, setStudentRecords] = useState<StudentHistoryRecord[] | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchDailyOverview(date).then((data) => {
      setSummary(data.summary);
      setClasses(data.classes);
      setLoading(false);
    });
  }, [date]);

  async function openClassModal(cls: ClassAttendanceRow) {
    setModalClass(cls);
    setModalLoading(true);
    const records = await fetchClassAttendance(cls.id, date);
    setModalRecords(records);
    setModalLoading(false);
  }

  async function handleStudentSearch(query: string) {
    setStudentSearch(query);
    if (query.length < 2) return setSearchResults([]);
    setSearchLoading(true);
    const results = await searchStudents(query);
    setSearchResults(results);
    setSearchLoading(false);
  }

  async function selectStudent(student: any) {
    setSearchResults([]);
    setStudentSearch(`${student.firstName} ${student.lastName}`);
    setStudentLoading(true);
    const data = await fetchStudentHistory(student.id);
    setStudentSummary(data.summary);
    setStudentRecords(data.records);
    setStudentLoading(false);
  }

  function changeDate(direction: "prev" | "next") {
    const d = new Date(date);
    d.setDate(d.getDate() + (direction === "next" ? 1 : -1));
    if (d <= new Date()) setDate(d.toISOString().split("T")[0]);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Attendance Overview</h1>
          <p className="mt-0.5 text-sm text-ulead-slate">Monitor attendance across all classes</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => changeDate("prev")} className="rounded-lg border border-ulead-line p-2 hover:bg-chalk"><ChevronLeft size={16} /></button>
          <input type="date" value={date} max={todayStr()} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen" />
          <button onClick={() => changeDate("next")} disabled={date === todayStr()} className="rounded-lg border border-ulead-line p-2 hover:bg-chalk disabled:opacity-40"><ChevronRight size={16} /></button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-evergreen" size={28} /></div>
      ) : (
        <>
          {summary && (
            <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Submitted" value={`${summary.submittedCount}/${summary.totalClasses}`} sub="classes" icon={<CheckCircle size={16} className="text-evergreen-deep" />} tone="evergreen" />
              <StatCard label="Total Present" value={summary.totalPresent} sub="students" icon={<Users size={16} className="text-ink" />} tone="ink" />
              <StatCard label="Total Absent" value={summary.totalAbsent} sub="students" icon={<XCircle size={16} className="text-red-500" />} tone="red" />
              <StatCard label="Not Submitted" value={summary.notSubmittedCount} sub="classes" icon={<XCircle size={16} className="text-marigold-deep" />} tone="marigold" />
            </div>
          )}

          {summary && summary.notSubmittedCount > 0 && (
            <div className="mb-5 rounded-2xl border border-marigold/30 bg-marigold/10 p-4">
              <p className="mb-2 text-sm font-semibold text-marigold-deep">
                {summary.notSubmittedCount} class{summary.notSubmittedCount > 1 ? "es have" : " has"} not submitted attendance today:
              </p>
              <div className="flex flex-wrap gap-2">
                {summary.notSubmittedClasses.map((name) => (
                  <span key={name} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-marigold-deep">{name}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 overflow-hidden rounded-2xl border border-ulead-line bg-chalk-card">
            <div className="border-b border-ulead-line p-5"><h2 className="font-serif text-base font-semibold text-ink">Class-by-Class Breakdown</h2></div>

            {/* Mobile */}
            <div className="space-y-3 p-4 md:hidden">
              {classes.map((cls) => (
                <div key={cls.id} className="rounded-2xl border border-ulead-line bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">{cls.className}</p>
                      <p className="mt-0.5 text-xs text-ulead-slate">{cls.teacherName}</p>
                    </div>
                    {cls.submitted ? (
                      <span className="flex items-center gap-1 rounded-full bg-evergreen/10 px-2.5 py-1 text-xs font-semibold text-evergreen-deep"><CheckCircle size={12} /> Submitted</span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500"><XCircle size={12} /> Not yet</span>
                    )}
                  </div>
                  {cls.submitted && (
                    <div className="divide-y divide-ulead-line border-t border-ulead-line">
                      <Row label="Present" value={cls.presentCount} color="text-evergreen-deep" />
                      <Row label="Absent" value={cls.absentCount} color="text-red-600" />
                      <Row label="Late" value={cls.lateCount} color="text-marigold-deep" />
                    </div>
                  )}
                  {cls.submitted && (
                    <button onClick={() => openClassModal(cls)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-evergreen/10 py-2.5 text-xs font-semibold text-evergreen-deep hover:bg-evergreen/20">
                      <Eye size={13} /> View Student Records
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="border-b border-ulead-line bg-chalk">
                  <tr>{["Class", "Teacher", "Status", "Present", "Absent", "Late", "Action"].map((h) => <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ulead-slate">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-ulead-line">
                  {classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-chalk/60">
                      <td className="px-5 py-4"><p className="text-sm font-semibold text-ink">{cls.className}</p><p className="text-xs text-ulead-slate">{cls.totalStudents} students</p></td>
                      <td className="px-5 py-4 text-sm text-ulead-slate">{cls.teacherName}</td>
                      <td className="px-5 py-4">
                        {cls.submitted ? (
                          <span className="flex w-fit items-center gap-1.5 rounded-full bg-evergreen/10 px-2.5 py-1 text-xs font-semibold text-evergreen-deep"><CheckCircle size={12} /> Submitted</span>
                        ) : (
                          <span className="flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500"><XCircle size={12} /> Not yet</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-evergreen-deep">{cls.submitted ? cls.presentCount : "—"}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-red-600">{cls.submitted ? cls.absentCount : "—"}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-marigold-deep">{cls.submitted ? cls.lateCount : "—"}</td>
                      <td className="px-5 py-4">
                        {cls.submitted ? (
                          <button onClick={() => openClassModal(cls)} className="flex items-center gap-1.5 rounded-lg bg-evergreen/10 px-3 py-1.5 text-xs font-medium text-evergreen-deep hover:bg-evergreen/20"><Eye size={13} /> View</button>
                        ) : <span className="text-xs text-ulead-line">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
            <h2 className="mb-4 font-serif text-base font-semibold text-ink">Student Attendance History</h2>

            <div className="relative mb-5">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ulead-slate" />
              <input value={studentSearch} onChange={(e) => handleStudentSearch(e.target.value)} placeholder="Search student by name or admission number..." className="w-full rounded-xl border border-ulead-line py-2.5 pl-9 pr-4 text-sm outline-none focus:border-evergreen" />
              {searchLoading && <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-ulead-slate" />}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-ulead-line bg-white py-1 shadow-lg">
                  {searchResults.map((s) => (
                    <button key={s.id} onClick={() => selectStudent(s)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-chalk">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 text-xs font-bold text-ink">{s.firstName?.charAt(0)}</div>
                      <div><p className="text-sm font-medium text-ink">{s.firstName} {s.lastName}</p><p className="font-mono text-xs text-ulead-slate">{s.admissionNumber}</p></div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {studentLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-evergreen" size={22} /></div>
            ) : studentSummary && studentRecords ? (
              <>
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatCard label="Attendance Rate" value={`${studentSummary.percentage}%`} tone="evergreen" small />
                  <StatCard label="Present" value={studentSummary.presentCount} tone="ink" small />
                  <StatCard label="Absent" value={studentSummary.absentCount} tone="red" small />
                  <StatCard label="Late" value={studentSummary.lateCount} tone="marigold" small />
                </div>
                <div className="overflow-hidden rounded-xl border border-ulead-line">
                  <table className="w-full">
                    <thead className="border-b border-ulead-line bg-chalk"><tr>{["Date", "Class", "Status"].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ulead-slate">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-ulead-line">
                      {studentRecords.map((r, i) => (
                        <tr key={i} className="hover:bg-chalk/60">
                          <td className="px-4 py-3 text-sm text-ulead-slate">{new Date(r.date).toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</td>
                          <td className="px-4 py-3 text-sm text-ulead-slate">{r.className}</td>
                          <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[r.status]}`}>{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {studentRecords.length === 0 && <div className="py-10 text-center text-sm text-ulead-slate">No attendance records found</div>}
                </div>
              </>
            ) : (
              <div className="py-10 text-center text-ulead-slate">
                <Search size={36} className="mx-auto mb-3 text-ulead-line" />
                <p className="text-sm">Search for a student to view their attendance history</p>
              </div>
            )}
          </div>
        </>
      )}

      {modalClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-ulead-line px-6 py-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-ink">{modalClass.className}</h2>
                <p className="mt-0.5 text-sm text-ulead-slate">{new Date(date).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <button onClick={() => setModalClass(null)} className="rounded-lg p-2 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {modalLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-evergreen" size={22} /></div>
              ) : modalRecords.length === 0 ? (
                <div className="py-12 text-center text-sm text-ulead-slate">No records found</div>
              ) : (
                <>
                  <div className="mb-5 grid grid-cols-4 gap-2">
                    <MiniStat label="Present" count={modalRecords.filter((r) => r.status === "PRESENT").length} color="text-evergreen-deep" bg="bg-evergreen/10" />
                    <MiniStat label="Absent" count={modalRecords.filter((r) => r.status === "ABSENT").length} color="text-red-600" bg="bg-red-50" />
                    <MiniStat label="Late" count={modalRecords.filter((r) => r.status === "LATE").length} color="text-marigold-deep" bg="bg-marigold/10" />
                    <MiniStat label="Excused" count={modalRecords.filter((r) => r.status === "EXCUSED").length} color="text-ink" bg="bg-ink/5" />
                  </div>
                  <div className="space-y-2">
                    {modalRecords.map((r) => (
                      <div key={r.studentId} className="flex items-center justify-between rounded-xl bg-chalk px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${r.gender === "MALE" ? "bg-ink/10 text-ink" : "bg-marigold/15 text-marigold-deep"}`}>{r.name?.charAt(0)}</div>
                          <div><p className="text-sm font-medium text-ink">{r.name}</p><p className="font-mono text-xs text-ulead-slate">{r.admissionNumber}</p></div>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[r.status]}`}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="border-t border-ulead-line p-4">
              <button onClick={() => setModalClass(null)} className="w-full rounded-xl bg-chalk py-2.5 text-sm font-medium text-ink hover:bg-ulead-line/40">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, icon, tone, small }: { label: string; value: string | number; sub?: string; icon?: React.ReactNode; tone: string; small?: boolean }) {
  const bg: Record<string, string> = { evergreen: "bg-evergreen/10", ink: "bg-ink/5", red: "bg-red-50", marigold: "bg-marigold/10" };
  const color: Record<string, string> = { evergreen: "text-evergreen-deep", ink: "text-ink", red: "text-red-600", marigold: "text-marigold-deep" };
  return (
    <div className={`rounded-2xl ${bg[tone]} p-4 ${small ? "text-center" : ""}`}>
      {!small && icon && <div className="mb-2 flex items-center justify-between"><p className="text-xs font-medium text-ulead-slate">{label}</p>{icon}</div>}
      <p className={`text-2xl font-bold ${color[tone]}`}>{value}</p>
      {small ? <p className="mt-0.5 text-xs text-ulead-slate">{label}</p> : sub && <p className="mt-0.5 text-xs text-ulead-slate">{sub}</p>}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: number; color: string }) {
  return <div className="flex items-center justify-between py-2"><p className="text-xs uppercase tracking-wide text-ulead-slate">{label}</p><p className={`text-sm font-bold ${color}`}>{value}</p></div>;
}

function MiniStat({ label, count, color, bg }: { label: string; count: number; color: string; bg: string }) {
  return <div className={`${bg} rounded-xl p-3 text-center`}><p className={`text-xl font-bold ${color}`}>{count}</p><p className="text-xs text-ulead-slate">{label}</p></div>;
}