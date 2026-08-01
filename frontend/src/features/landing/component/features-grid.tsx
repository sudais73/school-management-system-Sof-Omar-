import {
  ClipboardCheck,
  Sigma,
  Wallet,
  CalendarClock,
  Mail,
  Printer,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: ClipboardCheck,
    iconBg: "bg-evergreen/10",
    iconColor: "text-evergreen-deep",
    title: "Attendance",
    description:
      "Take roll in seconds, even offline. Parents get an alert the moment a student is marked absent.",
  },
  {
    icon: Sigma,
    iconBg: "bg-marigold/15",
    iconColor: "text-marigold-deep",
    title: "Grading & report cards",
    description: "Enter marks once. GPA, class ranking, and printable report cards update instantly.",
  },
  {
    icon: Wallet,
    iconBg: "bg-ink/[0.08]",
    iconColor: "text-ink",
    title: "Fees & payments",
    description: "Track every payment and outstanding balance, with automatic reminders before due dates.",
  },
  {
    icon: CalendarClock,
    iconBg: "bg-evergreen/10",
    iconColor: "text-evergreen-deep",
    title: "Timetable",
    description: "Build class and exam schedules with automatic room and teacher conflict detection.",
  },
  {
    icon: Mail,
    iconBg: "bg-marigold/15",
    iconColor: "text-marigold-deep",
    title: "Parent communication",
    description: "Reach every parent directly with announcements and alerts — no more lost paper notices.",
  },
  {
    icon: Printer,
    iconBg: "bg-ink/[0.08]",
    iconColor: "text-ink",
    title: "Printing",
    description: "Print receipts, report cards, and mark sheets straight from the system on any standard printer.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-8 py-20">
      <div className="mb-12 max-w-xl">
        <div className="mb-3 font-mono text-[12.5px] font-medium uppercase tracking-wide text-evergreen-deep">
          Core modules
        </div>
        <h2 className="mb-3 font-serif text-3xl font-semibold tracking-tight text-ink">
          Everything a school runs on, in one place
        </h2>
        <p className="text-[15.5px] leading-relaxed text-ulead-slate">
          Five connected modules replace the paper trail — each one built around how teachers,
          admins, and parents actually use it day to day.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ulead-line bg-ulead-line md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="bg-chalk-card p-7">
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${feature.iconBg} ${feature.iconColor}`}
              >
                <Icon size={18} />
              </div>
              <h3 className="mb-2 font-serif text-[17px] font-semibold text-ink">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-ulead-slate">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
