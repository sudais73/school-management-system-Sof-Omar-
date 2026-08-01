const roles = [
  {
    tag: "Admin",
    title: "Leadership",
    description: "Real-time attendance, fee collection, and performance dashboards across the whole school.",
  },
  {
    tag: "Staff",
    title: "Teachers",
    description: "Mark attendance and enter grades in minutes, on any device, online or off.",
  },
  {
    tag: "Family",
    title: "Parents",
    description: "See attendance, grades, and fee balances the moment they're recorded.",
  },
  {
    tag: "Learner",
    title: "Students",
    description: "Check schedules, grades, and school announcements in one place.",
  },
];

export function Roles() {
  return (
    <section id="roles" className="mx-auto max-w-6xl px-8 py-20">
      <div className="mb-12 max-w-xl">
        <div className="mb-3 font-mono text-[12.5px] font-medium uppercase tracking-wide text-evergreen-deep">
          Who it's for
        </div>
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink">One system, every role</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {roles.map((role) => (
          <div key={role.tag} className="rounded-2xl border border-ulead-line bg-chalk-card p-6">
            <div className="mb-2.5 font-mono text-[11px] uppercase tracking-wide text-marigold-deep">
              {role.tag}
            </div>
            <h3 className="mb-2 font-serif text-base font-semibold text-ink">{role.title}</h3>
            <p className="text-[13.5px] leading-relaxed text-ulead-slate">{role.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
