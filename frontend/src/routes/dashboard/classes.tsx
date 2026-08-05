import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Plus, GraduationCap, Users, BookOpen } from "lucide-react";
import { fetchClasses } from "@/features/classes/services/classes.api";
import { ClassStatCard } from "@/features/classes/components/class-stat-card";
import { ClassCard } from "@/features/classes/components/class-card";
import { ClassStatusBadge } from "@/features/classes/components/class-status-badge";
import type { SchoolClass } from "@/types/class";
import { AddClassModal } from "#/features/classes/components/AddClassModal";

export const Route = createFileRoute("/dashboard/classes")({
  component: ClassesPage,
});

function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const[openAddClassModal, setOpenAddClassModal] = useState(false);

  useEffect(() => {
    fetchClasses()
      .then(setClasses)
      .finally(() => setLoading(false));
  }, []);

  const filtered = classes.filter((c) => c.className.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalStudents = classes.reduce((sum, c) => sum + c.students.length, 0);
  const totalSubjects = classes.reduce((sum, c) => sum + c.subjects.length, 0);
  const activeClasses = classes.filter((c) => c.status === "ACTIVE").length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-ink">Classes</h1>
        <button
          onClick={() => {
            setOpenAddClassModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-evergreen px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-evergreen-deep"
        >
          <Plus size={16} />
          Add Class
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ClassStatCard label="Total classes" value={classes.length} variant="dark" />
        <ClassStatCard label="Total subjects" value={totalSubjects} />
        <ClassStatCard label="Total students" value={totalStudents} />
        <ClassStatCard label="Active classes" value={activeClasses} />
      </div>

      <div className="mb-5 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ulead-slate" />
          <input
            type="text"
            placeholder="Search by class name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-ulead-line bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-evergreen focus:ring-2 focus:ring-evergreen/15"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-ulead-slate">Loading classes...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ulead-line bg-chalk-card py-16 text-center text-sm text-ulead-slate">
          No classes found.
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filtered.map((c) => (
              <ClassCard key={c.id} classItem={c} />
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-2xl border border-ulead-line bg-chalk-card md:block">
            <table className="w-full">
              <thead className="border-b border-ulead-line bg-ulead-line/20">
                <tr>
                  {["Class", "Capacity", "Students", "Subjects", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ulead-slate">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ulead-line">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-chalk">
                    <td className="px-6 py-4 text-sm font-medium text-ink">{c.className}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-ulead-slate">
                        <GraduationCap size={14} className="text-evergreen-deep" />
                        {c.capacity ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-ulead-slate">
                        <Users size={14} className="text-marigold-deep" />
                        {c.students.length}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-ulead-slate">
                        <BookOpen size={14} className="text-ink" />
                        {c.subjects.length}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ClassStatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {
        openAddClassModal && (
          <AddClassModal onClose={() => setOpenAddClassModal(false)} editClass={null} />
        )
      }
    </div>
  );
}
  