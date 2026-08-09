
import { UserCircle } from "lucide-react";
import type { Role } from "@/features/dashboard/menu-items";
import { clearAuth } from "@/lib/auth-store";
import { apiClient } from "@/lib/api";
import { useNavigate } from "@tanstack/react-router";

type TopbarProps = {
  role: Role;
};

export function Topbar({ role }: TopbarProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    await apiClient.post("/api/auth/logout").catch(() => {});

    clearAuth();

    navigate({ to: "/login" });
  }

  return (
    <header className="p-4">
      {/* Temporary — swap for the real page title once routes/pages exist */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-grey-400">Dashboard</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-ulead-line px-3 py-1.5">
            <UserCircle size={18} className="text-ulead-slate" />
            <span className="text-sm font-medium text-ink">{role.toLocaleLowerCase()}</span>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-ulead-line px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
