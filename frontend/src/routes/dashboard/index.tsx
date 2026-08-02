import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const stats = [
  { label: "Students enrolled", value: "842" },
  { label: "Attendance today", value: "96%" },
  { label: "Fees collected (term)", value: "78%" },
  { label: "Active teachers", value: "37" },
];

function DashboardHome() {
  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-semibold text-ink">Welcome back</h1>
      <p className="mb-8 text-sm text-ulead-slate">Here's how U-Lead is doing today.</p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
            <div className="font-mono text-2xl font-semibold text-ink">{stat.value}</div>
            <div className="mt-1 text-xs text-ulead-slate">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-ulead-line bg-chalk-card p-8 text-center text-sm text-ulead-slate">
        Page content for each section (students, attendance, fees, etc.) goes here as we build them out.
      </div>
    </div>
  );
}
