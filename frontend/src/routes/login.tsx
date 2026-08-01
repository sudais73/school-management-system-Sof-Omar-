import { AuthLayout } from "#/components/layouts/auth-layout";
import { AuthField } from "#/features/auth/components/auth-field";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";


export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wired up once the auth API exists
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="mb-2 font-serif text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="text-sm text-ulead-slate">Log in to your U-Lead account.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <AuthField
          id="email"
          type="email"
          label="Email"
          placeholder="you@ulead.school"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthField
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="mb-6 flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-evergreen-deep hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white transition hover:bg-evergreen-deep"
        >
          Log in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ulead-slate">
        New to U-Lead?{" "}
        <Link to="/signup" className="font-medium text-evergreen-deep hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
