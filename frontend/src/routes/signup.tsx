import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { AuthField } from "@/features/auth/components/auth-field";
import { RoleSelect, type UserRole } from "@/features/auth/components/role-select";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wired up once the auth API exists
  }

  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="mb-2 font-serif text-2xl font-semibold text-ink">Create your account</h1>
        <p className="text-sm text-ulead-slate">Set up access to U-Lead's school system.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <AuthField
          id="fullName"
          type="text"
          label="Full name"
          placeholder="Selamawit Bekele"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
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
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <RoleSelect value={role} onChange={setRole} />

        <button
          type="submit"
          disabled={!role}
          className="w-full rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white transition hover:bg-evergreen-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ulead-slate">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-evergreen-deep hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
