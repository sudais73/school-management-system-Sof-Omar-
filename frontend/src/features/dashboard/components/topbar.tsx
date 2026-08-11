
import { MenuIcon, UserCircle } from "lucide-react";
import type { Role } from "@/features/dashboard/menu-items";
import { clearAuth } from "@/lib/auth-store";
import { apiClient } from "@/lib/api";
import { useNavigate } from "@tanstack/react-router";

type TopbarProps = {
  role: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function Topbar({ role, open, onOpenChange }: TopbarProps) {
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
        <MenuIcon onClick={() => onOpenChange(!open)} size={20} className="md:hidden text-grey-400" />
        <h1 className="hidden md:block text-lg font-semibold text-grey-400">Dashboard</h1>

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
