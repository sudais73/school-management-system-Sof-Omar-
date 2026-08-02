import type { Role } from "@/features/dashboard/menu-items";

const roles: Role[] = ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT", "STUDENT"];

type DevRoleSwitcherProps = {
  value: Role;
  onChange: (role: Role) => void;
};

/**
 * Temporary dev tool only — lets you preview the sidebar for each role
 * before real auth/session context exists. Remove once the logged-in
 * user's role comes from the session instead.
 */
export function DevRoleSwitcher({ value, onChange }: DevRoleSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-medium uppercase tracking-wide text-ulead-slate/70">
        Preview as
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Role)}
        className="rounded-md border border-ulead-line bg-white px-2 py-1.5 text-xs font-medium text-ink outline-none"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>
  );
}
