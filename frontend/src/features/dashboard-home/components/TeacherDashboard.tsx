import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Users, BookOpen, School, ClipboardCheck, CheckCircle, AlertCircle } from "lucide-react";
import { fetchTeacherSummary, type TeacherSummary } from "../services/dashboard.api";

export function TeacherDashboard() {
  const [summary, setSummary] = useState<TeacherSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherSummary().then((s) => {
      setSummary(s);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-chalk-card" />)}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-semibold text-ink">Welcome back</h1>
      <p className="mb-6 text-sm text-ulead-slate">Here's a summary of your classes.</p>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={<School size={18} />} label="Classes taught" value={summary.totalClasses} />
        <StatCard icon={<Users size={18} />} label="Students" value={summary.totalStudents} />
        <StatCard icon={<BookOpen size={18} />} label="Subjects" value={summary.totalSubjects} />
      </div>

      {summary.homeroomClass && (
        <div className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardCheck size={16} className="text-evergreen-deep" />
            <p className="text-sm font-semibold text-ink">Homeroom — {summary.homeroomClass.className}</p>
          </div>
          <p className="mb-3 text-xs text-ulead-slate">{summary.homeroomClass.studentCount} students</p>

          {summary.homeroomAttendanceSubmittedToday ? (
            <p className="flex items-center gap-2 text-sm font-medium text-evergreen-deep"><CheckCircle size={15} /> Attendance submitted today</p>
          ) : (
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-medium text-marigold-deep"><AlertCircle size={15} /> Attendance not yet submitted</p>
              <Link to="/dashboard/teacher/attendance" className="rounded-lg bg-evergreen px-3 py-1.5 text-xs font-semibold text-white hover:bg-evergreen-deep">Take attendance</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
      <div className="mb-2 flex items-center gap-2 text-ulead-slate">{icon}<p className="text-xs font-medium">{label}</p></div>
      <p className="font-mono text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}