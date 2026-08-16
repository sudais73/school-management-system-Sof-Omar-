import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { School, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";

export const Route = createFileRoute("/dashboard/my-children")({
  component: MyChildrenPage,
});

type Child = { id: string; firstName: string; lastName: string; admissionNumber: string; gender: string; class: { className: string } | null };

function MyChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ students: Child[] }>("/api/parents/my-children").then(({ data }) => {
      setChildren(data.students);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-evergreen" size={28} /></div>;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-ink">My Children</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children.map((child) => (
          <div key={child.id} className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${child.gender === "MALE" ? "bg-ink/10 text-ink" : "bg-marigold/15 text-marigold-deep"}`}>
                {child.firstName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{child.firstName} {child.lastName}</p>
                <p className="font-mono text-xs text-ulead-slate">{child.admissionNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-ulead-line pt-3 text-sm text-ulead-slate">
              <School size={14} /> {child.class?.className ?? "No class assigned"}
            </div>
          </div>
        ))}
        {children.length === 0 && <p className="text-sm text-ulead-slate">No children linked to your account yet.</p>}
      </div>
    </div>
  );
}