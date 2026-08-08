import { X } from "lucide-react";
import type { StudentListItem } from "@/types/student";

export function ViewStudentModal({ student, onClose }: { student: StudentListItem; onClose: () => void }) {
  const fields = [
    { label: "Admission No.", value: student.admissionNumber },
    { label: "Class", value: student.class?.className ?? "—" },
    { label: "Gender", value: student.gender ?? "—" },
    { label: "Status", value: student.status },
    { label: "Login email", value: student.user.email },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">{student.firstName} {student.lastName}</h2>
            <p className="mt-1 text-sm text-ulead-slate">Student profile</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100"><X size={20} /></button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.label} className="rounded-xl bg-chalk p-3">
                <p className="mb-1 text-xs uppercase tracking-wide text-ulead-slate">{f.label}</p>
                <p className="text-sm font-semibold text-ink">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}