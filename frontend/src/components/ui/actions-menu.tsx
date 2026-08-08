import { useState, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";

type ActionItem = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
};

export function ActionsMenu({ items }: { items: ActionItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="rounded-lg p-1.5 text-ulead-slate transition hover:bg-chalk hover:text-ink">
        <MoreHorizontal size={18} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-ulead-line bg-white py-1 shadow-lg">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => { item.onClick(); setIsOpen(false); }}
                className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition hover:bg-chalk ${item.variant === "danger" ? "text-red-600" : "text-ink"}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}