type ClassStatCardProps = {
  label: string;
  value: number | string;
  variant?: "dark" | "light";
};

export function ClassStatCard({ label, value, variant = "light" }: ClassStatCardProps) {
  if (variant === "dark") {
    return (
      <div className="rounded-2xl bg-ink p-5 text-white">
        <p className="mb-1 text-xs text-white/60">{label}</p>
        <p className="font-mono text-3xl font-semibold">{value}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ulead-line bg-chalk-card p-5">
      <p className="mb-1 text-xs text-ulead-slate">{label}</p>
      <p className="font-mono text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}