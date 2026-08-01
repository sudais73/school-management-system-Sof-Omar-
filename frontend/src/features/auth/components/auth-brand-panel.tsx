import { Wifi, ClipboardCheck, Bell } from "lucide-react";

const points = [
  { icon: Wifi, text: "Works offline — attendance and grades sync when the network returns" },
  { icon: ClipboardCheck, text: "Report cards and GPA update the instant marks are entered" },
  { icon: Bell, text: "Parents get alerts the moment attendance or fees change" },
];

export function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-ink px-14 py-12 md:flex md:flex-col md:justify-between">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 34px, rgba(255,255,255,0.035) 35px)",
          maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      />

      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[13px] font-semibold text-marigold">
          <span className="h-1.5 w-1.5 rounded-full bg-marigold" />
          U-Lead School Management System
        </div>
        <h2 className="max-w-sm font-serif text-3xl font-semibold leading-[1.15] text-white">
          Every student's progress, always in sync.
        </h2>
      </div>

      <div className="relative flex flex-col gap-5">
        {points.map((point) => {
          const Icon = point.icon;
          return (
            <div key={point.text} className="flex items-start gap-3.5">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-marigold">
                <Icon size={16} />
              </div>
              <p className="text-sm leading-relaxed text-[#C7CEDD]">{point.text}</p>
            </div>
          );
        })}
      </div>

      <div className="relative text-xs text-[#7C87A3]">© {new Date().getFullYear()} U-Lead School</div>
    </div>
  );
}
