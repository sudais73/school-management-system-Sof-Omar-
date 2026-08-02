import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { menuItems, type Role } from "@/features/dashboard/menu-items";

type SidebarProps = {
  role: Role;
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visibleItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-ink">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 font-serif text-base font-semibold text-marigold">
          U
        </span>
        <span className="font-serif text-lg font-semibold text-white">U-Lead</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Icon size={17} className={isActive ? "text-marigold" : "text-white/45"} />
                  <span className="flex-1">{item.label}</span>
                  {item.plan === "pro" && (
                    <span className="flex items-center gap-1 rounded-full bg-marigold/15 px-1.5 py-0.5 text-[10px] font-semibold text-marigold">
                      <Sparkles size={10} />
                      Pro
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="text-[11px] text-white/35">© {new Date().getFullYear()} U-Lead School</div>
      </div>
    </aside>
  );
}
