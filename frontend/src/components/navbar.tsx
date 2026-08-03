import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-ulead-line bg-chalk/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <Link to="/" className="flex items-center gap-2.5 font-serif text-xl font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink font-serif text-base font-semibold text-marigold">
            U
          </span>
          U-Lead
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          <a href="#features" className="text-sm font-medium text-ulead-slate hover:text-ink">
            Features
          </a>
          <a href="#offline" className="text-sm font-medium text-ulead-slate hover:text-ink">
            Offline-first
          </a>
          <a href="#roles" className="text-sm font-medium text-ulead-slate hover:text-ink">
            Who it's for
          </a>
        </div>

        <div className="flex items-center gap-3">
            <Link
            to="/login"
            className="rounded-lg border border-ulead-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ulead-line"
          >
            Log in
          </Link>
          <Link
            to="/login"
            className="rounded-lg bg-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-evergreen-deep"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
