import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "@/features/dashboard/components/sidebar";
import { Topbar } from "@/features/dashboard/components/topbar";
import { getAuthState, setAuth } from "@/lib/auth-store";
import { apiClient } from "@/lib/api";
import { menuItems, type Role } from "@/features/dashboard/menu-items";

function isRouteAllowed(pathname: string, role: Role): boolean {
  // Find the menu item that matches this URL — same matching logic the
  // sidebar already uses to highlight the active link.
  const matchingItem = menuItems.find(
    (item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );

  // A route not listed in the menu at all (e.g. something still being
  // built) is allowed by default — only routes we've explicitly scoped
  // to certain roles get blocked. Adjust this to `false` later if you
  // want new pages to be locked-down-by-default instead.
  if (!matchingItem) return true;

  return matchingItem.roles.includes(role);
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [role, setRole] = useState<Role | null>(getAuthState().role);
  const [checked, setChecked] = useState(!!getAuthState().token);
  const[openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    if (getAuthState().token) return;

    apiClient
      .post("/api/auth/refresh")
      .then(({ data }) => {
        setAuth({ token: data.token, role: data.role });
        setRole(data.role);
      })
      .catch(() => navigate({ to: "/login" }))
      .finally(() => setChecked(true));
  }, [navigate]);

  // Runs on every navigation, not just once — this is what catches
  // someone typing a URL directly, or clicking a stale bookmark.
  useEffect(() => {
    if (!role) return;
    if (!isRouteAllowed(pathname, role)) {
      navigate({ to: "/dashboard" });
    }
  }, [pathname, role, navigate]);

  if (!checked || !role) return null;

  return (
    <div className="flex h-screen bg-chalk">
      <Sidebar  open={openSidebar} onChange={()=>setOpenSidebar(!open)} role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar open={openSidebar} onOpenChange={setOpenSidebar} role={role} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}