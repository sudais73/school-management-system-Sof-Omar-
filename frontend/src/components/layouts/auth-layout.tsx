import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col px-8 py-10 md:px-16 md:py-12">
        <Link to="/" className="mb-12 flex items-center gap-2.5 font-serif text-xl font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink font-serif text-base font-semibold text-marigold">
            U
          </span>
          U-Lead
        </Link>

        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </div>
      </div>

      <AuthBrandPanel />
    </div>
  );
}
