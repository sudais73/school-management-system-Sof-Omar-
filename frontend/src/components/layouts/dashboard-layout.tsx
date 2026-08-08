import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/features/dashboard/components/sidebar";
import { Topbar } from "@/features/dashboard/components/topbar";
import { getAuthState, setAuth } from "@/lib/auth-store";
import { apiClient } from "@/lib/api";
import type { Role } from "@/features/dashboard/menu-items";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(getAuthState().role);
  const [checked, setChecked] = useState(!!getAuthState().token);

  useEffect(() => {
    if (getAuthState().token) return; // already have a session in memory

    apiClient
      .post("/api/auth/refresh")
      .then(({ data }) => {
        setAuth({ token: data.token, role: data.role });
        setRole(data.role);
      })
      .catch(() => navigate({ to: "/login" }))
      .finally(() => setChecked(true));
  }, [navigate]);

  if (!checked || !role) return null;

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