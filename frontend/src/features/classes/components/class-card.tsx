import { GraduationCap, Users, BookOpen, MoreHorizontal } from "lucide-react";
import type { SchoolClass } from "@/types/class";
import { ClassStatusBadge } from "./class-status-badge";

export function ClassCard({ classItem}: { classItem: SchoolClass}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ulead-line bg-chalk-card">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-evergreen/10 font-serif text-base font-semibold text-evergreen-deep">
            {classItem.className.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{classItem.className}</p>
            <p className="mt-0.5 text-xs text-ulead-slate">
              {new Date(classItem.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <ClassStatusBadge status={classItem.status} />
      </div>

      <div className="divide-y divide-ulead-line border-t border-ulead-line">
        <Row icon={<GraduationCap size={14} className="text-evergreen-deep" />} label="Capacity" value={classItem.capacity ?? "—"} />
        <Row icon={<Users size={14} className="text-marigold-deep" />} label="Students" value={classItem.students.length} />
        <Row icon={<BookOpen size={14} className="text-ink" />} label="Subjects" value={classItem.subjects.length} />
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <p className="text-xs uppercase tracking-wide text-ulead-slate">{label}</p>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-xs font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}