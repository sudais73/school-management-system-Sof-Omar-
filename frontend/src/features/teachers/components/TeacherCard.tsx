import { Mail, GraduationCap, Eye } from "lucide-react";
import { ActionsMenu } from "@/components/ui/actions-menu";
import type { TeacherListItem } from "@/types/teacher";

export function TeacherCard({ teacher, onView }: { teacher: TeacherListItem; onView: () => void }) {
  return (
    <div className="rounded-2xl border border-ulead-line bg-chalk-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-evergreen/10 text-sm font-semibold text-evergreen-deep">
            {teacher.user.fullName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{teacher.user.fullName}</p>
            <p className="font-mono text-xs text-ulead-slate">{teacher.employeeId ?? "—"}</p>
          </div>
        </div>
        <ActionsMenu items={[{ label: "View profile", icon: <Eye size={14} />, onClick: onView }]} />
      </div>
      <div className="space-y-1.5 border-t border-ulead-line pt-3 text-sm text-ulead-slate">
        <p className="flex items-center gap-2"><Mail size={13} /> {teacher.user.email}</p>
        <p className="flex items-center gap-2"><GraduationCap size={13} /> {teacher.department ?? "—"} · {teacher.designation ?? "—"}</p>
      </div>
      {teacher.subjects.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-ulead-line pt-3">
          {teacher.subjects.slice(0, 3).map((s) => (
            <span key={s.id} className="rounded-full bg-marigold/15 px-2 py-0.5 text-xs font-medium text-marigold-deep">{s.name}</span>
          ))}
          {teacher.subjects.length > 3 && <span className="text-xs text-ulead-slate">+{teacher.subjects.length - 3} more</span>}
        </div>
      )}
    </div>
  );
}