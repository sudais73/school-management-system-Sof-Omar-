import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { School, ClipboardCheck, TrendingUp } from "lucide-react";
import { fetchParentSummary, type ParentChildSummary } from "../services/dashboard.api";
import { gradeColor } from "@/features/results-shared/grade-display";

export function ParentDashboard() {
  const [children, setChildren] = useState<ParentChildSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParentSummary().then((c) => {
      setChildren(c);
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
      <p className="mb-6 text-sm text-ulead-slate">Here's a quick look at your children.</p>

      {children.length === 0 ? (
        <p className="text-sm text-ulead-slate">No children linked to your account yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {children.map((child) => (
            <div key={child.id} className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${child.gender === "MALE" ? "bg-ink/10 text-ink" : "bg-marigold/15 text-marigold-deep"}`}>
                  {child.firstName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{child.firstName} {child.lastName}</p>
                  <p className="flex items-center gap-1 text-xs text-ulead-slate"><School size={12} /> {child.className ?? "No class assigned"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-ulead-line pt-3">
                <div>
                  <p className="mb-1 flex items-center gap-1 text-xs text-ulead-slate"><ClipboardCheck size={12} /> Attendance</p>
                  <p className="font-mono text-lg font-bold text-evergreen-deep">{child.attendancePercentage !== null ? `${child.attendancePercentage}%` : "—"}</p>
                </div>
                <div>
                  <p className="mb-1 flex items-center gap-1 text-xs text-ulead-slate"><TrendingUp size={12} /> Latest grade</p>
                  <p className={`font-mono text-lg font-bold ${child.overallGrade ? gradeColor[child.overallGrade] ?? "text-ink" : "text-ulead-line"}`}>
                    {child.overallGrade ?? "—"}
                  </p>
                </div>
              </div>

              <Link to="/dashboard/parent/results" className="mt-4 block rounded-lg bg-evergreen/10 py-2 text-center text-xs font-semibold text-evergreen-deep hover:bg-evergreen/20">
                View full result
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}