import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { fetchStudents } from "@/features/students/services/students.api";
import { fetchClasses } from "@/features/classes/services/classes.api";
import { AddStudentModal } from "@/features/students/components/AddStudentModal";
import type { StudentListItem } from "@/types/student";
import type { SchoolClass } from "@/types/class";

export const Route = createFileRoute("/dashboard/students")({
  component: StudentsPage,
});

function StudentsPage() {
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  function loadStudents() {
    return fetchStudents().then(setStudents);
  }

  useEffect(() => {
    Promise.all([loadStudents(), fetchClasses().then(setClasses)]).finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maleCount = students.filter((s) => s.gender === "MALE").length;
  const femaleCount = students.filter((s) => s.gender === "FEMALE").length;
  const graduatedCount = students.filter((s) => s.status === "GRADUATED").length;
  const activeCount = students.filter((s) => s.status === "ACTIVE").length;
  const suspendedCount = students.filter((s) => s.status === "SUSPENDED").length;
  const newThisMonth = students.filter((s) => {
    const d = new Date(s.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const statusStyle: Record<string, string> = {
    ACTIVE: "bg-evergreen/10 text-evergreen-deep",
    GRADUATED: "bg-ink/10 text-ink",
    SUSPENDED: "bg-red-100 text-red-700",
    INACTIVE: "bg-gray-100 text-gray-600",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-ink">Students</h1>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 rounded-lg bg-evergreen px-4 py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep">
          <UserPlus size={16} />
          Add Student
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total students" value={students.length} />
        <StatCard label="Male" value={maleCount} />
        <StatCard label="Female" value={femaleCount} />
        <StatCard label="Graduated" value={graduatedCount} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active students" value={activeCount} />
        <StatCard label="New this month" value={newThisMonth} />
        <StatCard label="Suspended" value={suspendedCount} />
      </div>

      <div className="mb-5 max-w-xs">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ulead-slate" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search students..." className="w-full rounded-lg border border-ulead-line bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-evergreen focus:ring-2 focus:ring-evergreen/15" />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-ulead-slate">Loading students...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ulead-line bg-chalk-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-ulead-line bg-chalk">
                <tr>
                  {["Name", "Class", "Admission No", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ulead-slate">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ulead-line">
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-sm text-ulead-slate">No students found</td></tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-chalk/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-marigold/15 text-sm font-semibold text-marigold-deep">
                            {s.firstName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-ink">{s.firstName} {s.lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-ulead-slate">{s.class?.className ?? "—"}</td>
                      <td className="px-6 py-4 font-mono text-sm text-ulead-slate">{s.admissionNumber}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[s.status]}`}>{s.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isAddOpen && (
        <AddStudentModal open={isAddOpen} classes={classes} onClose={() => setIsAddOpen(false)} onSuccess={loadStudents} />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
      <p className="mb-1 text-xs text-ulead-slate">{label}</p>
      <p className="font-mono text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}