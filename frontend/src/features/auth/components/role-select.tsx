import { ShieldCheck, GraduationCap, Users, BookOpen, type LucideIcon } from "lucide-react";

export type UserRole = "admin" | "teacher" | "parent" | "student";

type RoleOption = {
  value: UserRole;
  icon: LucideIcon;
  title: string;
  description: string;
};

const roles: RoleOption[] = [
  { value: "admin", icon: ShieldCheck, title: "Admin", description: "School leadership & staff" },
  { value: "teacher", icon: GraduationCap, title: "Teacher", description: "Attendance & grading" },
  { value: "parent", icon: Users, title: "Parent", description: "Track my child" },
  { value: "student", icon: BookOpen, title: "Student", description: "My classes & grades" },
];

type RoleSelectProps = {
  value: UserRole | null;
  onChange: (role: UserRole) => void;
};

export function RoleSelect({ value, onChange }: RoleSelectProps) {
  return (
    <div className="mb-5">
      <span className="mb-1.5 block text-sm font-medium text-ink">I am a...</span>
      <div role="radiogroup" aria-label="Account role" className="grid grid-cols-2 gap-2.5">
        {roles.map((role) => {
          const Icon = role.icon;
          const selected = value === role.value;
          return (
            <button
              key={role.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(role.value)}
              className={`flex flex-col items-start gap-2 rounded-lg border px-3.5 py-3 text-left transition ${
                selected
                  ? "border-evergreen bg-evergreen/[0.06]"
                  : "border-ulead-line bg-white hover:border-ink/30"
              }`}
            >
              <Icon size={18} className={selected ? "text-evergreen-deep" : "text-ulead-slate"} />
              <div>
                <div className="text-sm font-semibold text-ink">{role.title}</div>
                <div className="text-xs text-ulead-slate">{role.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
