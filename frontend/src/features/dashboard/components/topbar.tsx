import { UserCircle } from "lucide-react";
import { DevRoleSwitcher } from "@/features/dashboard/components/dev-role-switcher";
import type { Role } from "@/features/dashboard/menu-items";

type TopbarProps = {
  role: Role;
  onRoleChange: (role: Role) => void;
};

export function Topbar({ role, onRoleChange }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-ulead-line bg-chalk-card px-6">
      {/* Temporary — swap for the real page title once routes/pages exist */}
      <div className="font-serif text-lg font-semibold text-ink">Dashboard</div>

      <div className="flex items-center gap-4">
        <DevRoleSwitcher value={role} onChange={onRoleChange} />
        <div className="flex items-center gap-2 rounded-lg border border-ulead-line px-3 py-1.5">
          <UserCircle size={18} className="text-ulead-slate" />
          <span className="text-sm font-medium text-ink">Admin User</span>
        </div>
      </div>
    </header>
  );
}
