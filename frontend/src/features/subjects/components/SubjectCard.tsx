import { Plus, BookOpen } from "lucide-react";
import type { ClassWithSubjects } from "@/types/subject";

type SubjectCardProps = {
  classItem: ClassWithSubjects;
  onAddSubject: (classId: string) => void;
};

export function SubjectCard({ classItem, onAddSubject }: SubjectCardProps) {
  return (
    <div className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-base font-semibold text-ink">{classItem.className}</h3>
        <button
          onClick={() => onAddSubject(classItem.id)}
          className="flex items-center gap-1 rounded-lg bg-evergreen px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-evergreen-deep"
        >
          <Plus size={13} />
          Add
        </button>
      </div>

      {classItem.subjects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-ulead-line py-6 text-center text-xs text-ulead-slate">
          No subjects yet
        </p>
      ) : (
        <ul className="space-y-2">
          {classItem.subjects.map((s) => (
            <li key={s.id} className="flex items-center justify-between rounded-lg bg-chalk px-3 py-2">
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <BookOpen size={13} className="text-evergreen-deep" />
                {s.name}
              </span>
              <span className="text-xs text-ulead-slate">
                {s.teacher ? s.teacher.user.fullName : <span className="italic text-marigold-deep">Unassigned</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}