import { Eye, School } from "lucide-react";
import { ActionsMenu } from "@/components/ui/actions-menu";
import type { StudentListItem } from "@/types/student";

const statusStyle: Record<string, string> = {
  ACTIVE: "bg-evergreen/10 text-evergreen-deep",
  GRADUATED: "bg-ink/10 text-ink",
  SUSPENDED: "bg-red-100 text-red-700",
  INACTIVE: "bg-gray-100 text-gray-600",
};

export function StudentCard({ student, onView }: { student: StudentListItem; onView: () => void }) {
  return (
    <div className="rounded-2xl border border-ulead-line bg-chalk-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-marigold/15 text-sm font-semibold text-marigold-deep">
            {student.firstName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{student.firstName} {student.lastName}</p>
            <p className="font-mono text-xs text-ulead-slate">{student.admissionNumber}</p>
          </div>
        </div>
        <ActionsMenu items={[{ label: "View profile", icon: <Eye size={14} />, onClick: onView }]} />
      </div>
      <div className="flex items-center justify-between border-t border-ulead-line pt-3 text-sm text-ulead-slate">
        <p className="flex items-center gap-2"><School size={13} /> {student.class?.className ?? "No class"}</p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[student.status]}`}>{student.status}</span>
      </div>
    </div>
  );
}