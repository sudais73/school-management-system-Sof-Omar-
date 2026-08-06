import { useEffect, useState } from "react";
import { X, GraduationCap, Users, BookOpen } from "lucide-react";
import { getClassById } from "../services/classes.api";
import { ClassStatusBadge } from "./class-status-badge";
import type { SchoolClassDetail } from "@/types/class";

export function ViewClassModal({ classId, onClose }: { classId: string; onClose: () => void }) {
  const [classData, setClassData] = useState<SchoolClassDetail | null>(null);
  const [loading, setLoading] = useState(true);

 function loadClass() {
    setLoading(true);
    getClassById(classId)
      .then(setClassData)
      .finally(() => setLoading(false));
  }
useEffect(() => {
    loadClass();
  }
, [classId]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">{classData?.className ?? "Class details"}</h2>
            <p className="mt-1 text-sm text-gray-500">Full class overview</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {loading ? (
            <p className="text-sm text-ulead-slate">Loading...</p>
          ) : !classData ? (
            <p className="text-sm text-ulead-slate">Class not found.</p>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-ulead-line p-3 text-center">
                  <GraduationCap size={16} className="mx-auto mb-1 text-evergreen-deep" />
                  <p className="font-mono text-lg font-semibold text-ink">{classData.capacity ?? "—"}</p>
                  <p className="text-xs text-ulead-slate">Capacity</p>
                </div>
                <div className="rounded-xl border border-ulead-line p-3 text-center">
                  <Users size={16} className="mx-auto mb-1 text-marigold-deep" />
                  <p className="font-mono text-lg font-semibold text-ink">{classData.students.length}</p>
                  <p className="text-xs text-ulead-slate">Students</p>
                </div>
                <div className="rounded-xl border border-ulead-line p-3 text-center">
                  <BookOpen size={16} className="mx-auto mb-1 text-ink" />
                  <p className="font-mono text-lg font-semibold text-ink">{classData.subjects.length}</p>
                  <p className="text-xs text-ulead-slate">Subjects</p>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-serif text-sm font-semibold text-ink">Subjects & teachers</h3>
                <ClassStatusBadge status={classData.status} />
              </div>

              {classData.subjects.length === 0 ? (
                <p className="rounded-lg border border-dashed border-ulead-line py-6 text-center text-sm text-ulead-slate">
                  No subjects assigned yet.
                </p>
              ) : (
                <ul className="divide-y divide-ulead-line rounded-lg border border-ulead-line">
                  {classData.subjects.map((s) => (
                    <li key={s.id} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-medium text-ink">{s.name}</span>
                      <span className="text-sm text-ulead-slate">
                        {s.teacher ? s.teacher.fullName : <span className="italic text-marigold-deep">Unassigned</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}