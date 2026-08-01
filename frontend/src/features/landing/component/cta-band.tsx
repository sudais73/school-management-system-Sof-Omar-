import { Link } from "@tanstack/react-router";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-8 py-16 text-center">
      <div className="mb-3 font-mono text-[12.5px] font-medium uppercase tracking-wide text-evergreen-deep">
        Get started
      </div>
      <h2 className="mx-auto mb-3.5 max-w-lg font-serif text-4xl font-semibold tracking-tight text-ink">
        Ready to lead U-Lead forward?
      </h2>
      <p className="mx-auto mb-7 max-w-md text-[15.5px] leading-relaxed text-ulead-slate">
        Set up your school's account and move attendance, grading, and fees online this term.
      </p>
      <Link
        to="/signup"
        className="inline-block rounded-lg bg-evergreen px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-evergreen-deep"
      >
        Create account
      </Link>
    </section>
  );
}
