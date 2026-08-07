import { useState, type ReactNode } from "react";
import { Sidebar } from "@/features/dashboard/components/sidebar";
import { Topbar } from "@/features/dashboard/components/topbar";
import type { Role } from "@/features/dashboard/menu-items";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // TEMPORARY: replace with the real logged-in user's role from session/auth
  // context once auth is wired up. This local state only exists so the
  // sidebar can be previewed per-role before that's ready.
  const [role, setRole] = useState<Role>("SUPER_ADMIN");

  return (
    <div className="flex h-screen bg-chalk">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar role={role} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
