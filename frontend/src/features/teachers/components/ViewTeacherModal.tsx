import { X } from "lucide-react";
import type { TeacherListItem } from "@/types/teacher";

export function ViewTeacherModal({ teacher, onClose }: { teacher: TeacherListItem; onClose: () => void }) {
  const fields = [
    { label: "Staff ID", value: teacher.employeeId ?? "—" },
    { label: "Department", value: teacher.department ?? "—" },
    { label: "Designation", value: teacher.designation ?? "—" },
    { label: "Gender", value: teacher.gender ?? "—" },
    { label: "Phone", value: teacher.phone ?? "—" },
    { label: "Email", value: teacher.user.email },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">{teacher.user.fullName}</h2>
            <p className="mt-1 text-sm text-ulead-slate">Teacher profile</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100"><X size={20} /></button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="mb-6 grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.label} className="rounded-xl bg-chalk p-3">
                <p className="mb-1 text-xs uppercase tracking-wide text-ulead-slate">{f.label}</p>
                <p className="text-sm font-semibold text-ink">{f.value}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-2 font-serif text-sm font-semibold text-ink">Subjects taught</h3>
          {teacher.subjects.length === 0 ? (
            <p className="rounded-lg border border-dashed border-ulead-line py-6 text-center text-sm text-ulead-slate">No subjects assigned yet.</p>
          ) : (
            <ul className="divide-y divide-ulead-line rounded-lg border border-ulead-line">
              {teacher.subjects.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="font-medium text-ink">{s.name}</span>
                  <span className="text-ulead-slate">{s.class.className}</span>
                </li>
              ))}
            </ul>
          )}

          {teacher.classesOwned.length > 0 && (
            <p className="mt-4 text-sm text-ulead-slate">
              Homeroom owner of: <span className="font-medium text-ink">{teacher.classesOwned.map((c) => c.className).join(", ")}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}