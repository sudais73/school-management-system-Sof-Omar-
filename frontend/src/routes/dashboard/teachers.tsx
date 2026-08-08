import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, UserPlus, Eye } from "lucide-react";
import { fetchTeachers } from "@/features/teachers/services/teachers.api";
import { fetchClassesWithSubjects } from "@/features/subjects/services/subjects.api";
import { AddTeacherModal } from "@/features/teachers/components/AddTeacherModal";
import { TeacherCard } from "@/features/teachers/components/TeacherCard";
import { ViewTeacherModal } from "@/features/teachers/components/ViewTeacherModal";
import { ActionsMenu } from "@/components/ui/actions-menu";
import type { TeacherListItem, ClassWithSubjectsForAssignment } from "@/types/teacher";

export const Route = createFileRoute("/dashboard/teachers")({
  component: TeachersPage,
});

function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherListItem[]>([]);
  const [classes, setClasses] = useState<ClassWithSubjectsForAssignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<TeacherListItem | null>(null);

  function loadTeachers() {
    return fetchTeachers().then(setTeachers);
  }

  useEffect(() => {
    Promise.all([loadTeachers(), fetchClassesWithSubjects().then(setClasses)]).finally(() => setLoading(false));
  }, []);

  const filtered = teachers.filter((t) => {
    const q = searchTerm.toLowerCase();
    return t.user.fullName.toLowerCase().includes(q) || t.user.email.toLowerCase().includes(q) || t.employeeId?.toLowerCase().includes(q);
  });

  const maleCount = teachers.filter((t) => t.gender === "MALE").length;
  const femaleCount = teachers.filter((t) => t.gender === "FEMALE").length;
  const homeroomCount = teachers.filter((t) => t.classesOwned.length > 0).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-ink">Teachers</h1>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 rounded-lg bg-evergreen px-4 py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep">
          <UserPlus size={16} />
          <span className="hidden sm:inline">Add Teacher</span>
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total teachers" value={teachers.length} />
        <StatCard label="Male" value={maleCount} />
        <StatCard label="Female" value={femaleCount} />
        <StatCard label="Homeroom owners" value={homeroomCount} />
      </div>

      <div className="mb-5 max-w-xs">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ulead-slate" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search teachers..." className="w-full rounded-lg border border-ulead-line bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-evergreen focus:ring-2 focus:ring-evergreen/15" />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-ulead-slate">Loading teachers...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ulead-line bg-chalk-card py-16 text-center text-sm text-ulead-slate">No teachers found.</div>
      ) : (
        <>
          {/* Mobile */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filtered.map((t) => (
              <TeacherCard key={t.id} teacher={t} onView={() => setViewingTeacher(t)} />
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-2xl border border-ulead-line bg-chalk-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-ulead-line bg-chalk">
                  <tr>
                    {["Name", "Staff ID", "Department", "Designation", "Subjects", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ulead-slate">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ulead-line">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-chalk/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-evergreen/10 text-sm font-semibold text-evergreen-deep">
                            {t.user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-ink">{t.user.fullName}</p>
                            <p className="text-xs text-ulead-slate">{t.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-ulead-slate">{t.employeeId ?? "—"}</td>
                      <td className="px-6 py-4 text-sm text-ulead-slate">{t.department ?? "—"}</td>
                      <td className="px-6 py-4 text-sm text-ulead-slate">{t.designation ?? "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {t.subjects.slice(0, 2).map((s) => (
                            <span key={s.id} className="rounded-full bg-marigold/15 px-2 py-0.5 text-xs font-medium text-marigold-deep">{s.name}</span>
                          ))}
                          {t.subjects.length > 2 && <span className="text-xs text-ulead-slate">+{t.subjects.length - 2} more</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ActionsMenu items={[{ label: "View profile", icon: <Eye size={14} />, onClick: () => setViewingTeacher(t) }]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {isAddOpen && <AddTeacherModal open={isAddOpen} classes={classes} onClose={() => setIsAddOpen(false)} onSuccess={loadTeachers} />}
      {viewingTeacher && <ViewTeacherModal teacher={viewingTeacher} onClose={() => setViewingTeacher(null)} />}
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