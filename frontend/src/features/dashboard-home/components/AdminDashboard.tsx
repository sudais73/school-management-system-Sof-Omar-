import { useEffect, useState } from "react";
import { Users, GraduationCap, School, ClipboardCheck, Wallet } from "lucide-react";
import { fetchAdminSummary, type AdminSummary } from "../services/dashboard.api";

export function AdminDashboard() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminSummary().then((s) => {
      setSummary(s);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-chalk-card" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-semibold text-ink">Welcome back</h1>
      <p className="mb-6 text-sm text-ulead-slate">Here's how U-Lead is doing today.</p>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={<Users size={18} />} label="Students" value={summary.totalStudents} />
        <StatCard icon={<GraduationCap size={18} />} label="Teachers" value={summary.totalTeachers} />
        <StatCard icon={<School size={18} />} label="Classes" value={summary.totalClasses} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardCheck size={16} className="text-evergreen-deep" />
            <p className="text-sm font-semibold text-ink">Attendance today</p>
          </div>
          {summary.attendanceToday.rate === null ? (
            <p className="text-sm text-ulead-slate">No classes have submitted attendance yet today.</p>
          ) : (
            <>
              <p className="font-mono text-3xl font-semibold text-evergreen-deep">{summary.attendanceToday.rate}%</p>
              <p className="mt-1 text-xs text-ulead-slate">{summary.attendanceToday.classesSubmitted} of {summary.attendanceToday.totalClasses} classes submitted</p>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Wallet size={16} className="text-marigold-deep" />
            <p className="text-sm font-semibold text-ink">Fees collected</p>
          </div>
          <p className="font-mono text-3xl font-semibold text-marigold-deep">{summary.fees.percentage}%</p>
          <p className="mt-1 text-xs text-ulead-slate">Br {summary.fees.collected.toLocaleString()} of Br {summary.fees.expected.toLocaleString()} expected</p>
        </div>
      </div>
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