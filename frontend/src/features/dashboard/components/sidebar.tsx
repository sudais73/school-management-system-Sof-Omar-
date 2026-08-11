// import { Link, useRouterState } from "@tanstack/react-router";
// import { menuItems, type Role } from "@/features/dashboard/menu-items";

// type SidebarProps = {
//   role: Role;
//   open: boolean;
// };

// export function Sidebar({ role, open }: SidebarProps) {
//   const pathname = useRouterState({ select: (s) => s.location.pathname });
//   const visibleItems = menuItems.filter((item) => item.roles.includes(role));

//   return (
//     <aside className={`flex h-screen w-64 shrink-0 flex-col bg-ink ${open ? "block" : "hidden"}`}>
//       <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
//         <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 font-serif text-base font-semibold text-marigold">
//           U
//         </span>
//         <span className="font-serif text-lg font-semibold text-white">U-Lead</span>
//       </div>

//       <nav className="flex-1 overflow-y-auto px-3 py-4">
//         <ul className="flex flex-col gap-0.5">
//           {visibleItems.map((item) => {
//             const Icon = item.icon;
//             const isActive =
//               pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

//             return (
//               <li key={item.href}>
//                 <Link
//                   to={item.href}
//                   className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
//                     isActive
//                       ? "bg-white/[0.08] text-white"
//                       : "text-white/60 hover:bg-white/[0.05] hover:text-white"
//                   }`}
//                 >
//                   <Icon size={17} className={isActive ? "text-marigold" : "text-white/45"} />
//                   <span className="flex-1">{item.label}</span>

//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       <div className="border-t border-white/10 px-4 py-4">
//         <div className="text-[11px] text-white/35">© {new Date().getFullYear()} U-Lead School</div>
//       </div>
//     </aside>
//   );
// }

import { Link, useRouterState } from "@tanstack/react-router";
import { menuItems, type Role } from "@/features/dashboard/menu-items";
import { X } from "lucide-react";

type SidebarProps = {
  role: Role;
  open: boolean;
  onChange?: () => void;
};

export function Sidebar({ role, open, onChange }: SidebarProps) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onChange}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[280px] shrink-0 flex-col bg-ink
          shadow-xl transition-transform duration-300 ease-in-out

          md:static md:z-auto md:h-screen md:w-64
          md:translate-x-0 md:shadow-none

          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 font-serif text-base font-semibold text-marigold">
              U
            </span>

            <span className="font-serif text-lg font-semibold text-white">
              U-Lead
            </span>
          </div>
          <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5 md:hidden">
            <X size={30} onClick={onChange} color="white"/>
          </div>

        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {visibleItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={onChange}
                    className={`
                      flex items-center gap-3 rounded-lg
                      px-3 py-2.5 text-sm font-medium
                      transition-colors

                      ${isActive
                        ? "bg-white/[0.08] text-white"
                        : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      size={17}
                      className={
                        isActive
                          ? "text-marigold"
                          : "text-white/45"
                      }
                    />

                    <span className="flex-1">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-4">
          <div className="text-[11px] text-white/35">
            © {new Date().getFullYear()} U-Lead School
          </div>
        </div>
      </aside>
    </>
  );
}

