import { Link } from "@tanstack/react-router";
import { ReportCardMock } from "./report-card-mock";

export function Hero() {
  return (
    <header className="relative overflow-hidden py-20 md:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 34px, rgba(20,33,61,0.05) 35px)",
          maskImage: "linear-gradient(to bottom, transparent, black 30%, black 65%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%, black 65%, transparent)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-8 md:grid-cols-2">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-evergreen/20 bg-evergreen/[0.08] px-3.5 py-1.5 text-[13px] font-semibold text-evergreen-deep">
            <span className="h-1.5 w-1.5 rounded-full bg-evergreen" />
            Built for U-Lead School
          </div>

          <h1 className="mb-5 font-serif text-4xl font-semibold leading-[1.06] tracking-tight text-ink md:text-5xl">
            Lead every student <em className="text-evergreen not-italic italic">forward.</em>
          </h1>

          <p className="mb-8 max-w-md text-[17px] leading-relaxed text-ulead-slate">
            Replace paper registers, gradebooks, and lost notices with one connected system —
            attendance, grades, fees, and parent updates, all synced automatically, even when the
            internet isn't.
          </p>

          <div className="mb-8 flex flex-wrap gap-3.5">
            <Link
              to="/login"
              className="rounded-lg bg-marigold px-6 py-3.5 text-[15px] font-semibold text-ink transition hover:bg-marigold-deep hover:text-white hover:-translate-y-0.5"
            >
              Get started
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-ulead-line px-6 py-3.5 text-[15px] font-semibold text-ink transition hover:border-ink"
            >
              See how it works
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[13px] text-ulead-slate">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-marigold" />
              Works offline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-marigold" />
              English · Amharic · Afaan Oromo
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <ReportCardMock />
        </div>
      </div>
    </header>
  );
}
