import type { GradeComponent } from "@/types/grade";
import { gradeFor, remarkFor, gradeBadgeClass } from "../grade-helpers";

type StudentScoreCardProps = {
  student: { id: string; firstName: string; lastName: string; admissionNumber: string };
  components: GradeComponent[];
  scores: Record<string, number>;
  editingComponents: Set<string>;
  grandMax: number;
  onScoreChange: (studentId: string, componentId: string, value: number, maxScore: number) => void;
};

export function StudentScoreCard({ student, components, scores, editingComponents, grandMax, onScoreChange }: StudentScoreCardProps) {
  const hasAny = components.some((c) => scores[c.id] !== undefined);
  const total = components.reduce((sum, c) => sum + (scores[c.id] || 0), 0);
  const grade = hasAny ? gradeFor(total, grandMax) : "";

  return (
    <div className="rounded-2xl border border-ulead-line bg-chalk-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">{student.firstName} {student.lastName}</p>
          <p className="font-mono text-xs text-ulead-slate">{student.admissionNumber}</p>
        </div>
        {grade ? (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${gradeBadgeClass(grade)}`}>{grade}</span>
        ) : (
          <span className="text-xs text-ulead-slate">Not scored</span>
        )}
      </div>

      <div className="space-y-2 border-t border-ulead-line pt-3">
        {components.map((comp) => {
          const score = scores[comp.id];
          const isReleased = comp.status === "PUBLISHED";
          const isEditing = editingComponents.has(comp.id);
          const showInput = !isReleased || isEditing;

          return (
            <div key={comp.id} className="flex items-center justify-between">
              <span className="text-xs text-ulead-slate">
                {comp.name} <span className="text-ulead-slate/70">/{comp.maxScore}</span>
              </span>
              {showInput ? (
                <input
                  type="number"
                  min={0}
                  max={comp.maxScore}
                  value={score ?? ""}
                  placeholder="—"
                  onChange={(e) => onScoreChange(student.id, comp.id, parseInt(e.target.value) || 0, comp.maxScore)}
                  className={`w-16 rounded-lg border px-2 py-1.5 text-center text-sm outline-none ${isEditing ? "border-marigold bg-marigold/10" : "border-ulead-line"}`}
                />
              ) : (
                <span className="w-16 rounded-lg bg-evergreen/10 px-2 py-1.5 text-center text-sm font-semibold text-evergreen-deep">
                  {score ?? "—"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {hasAny && (
        <div className="mt-3 flex items-center justify-between border-t border-ulead-line pt-3">
          <div>
            <span className="text-xs text-ulead-slate">Total: </span>
            <span className="text-sm font-bold text-ink">{total}</span>
          </div>
          <p className="text-xs text-ulead-slate">{remarkFor(grade)}</p>
        </div>
      )}
    </div>
  );
}