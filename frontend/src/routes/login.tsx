import { AuthLayout } from "#/components/layouts/auth-layout";
import { AuthField } from "#/features/auth/components/auth-field";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";
import { apiClient } from "@/lib/api";
import { setAuth } from "#/lib/auth-store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    apiClient
      .post("/api/auth/login", { email, password })
      .then(({ data }) => {
       setAuth({ token: data.token, role: data.role });

        if (data.mustChangePassword) {
          navigate({ to: "/change-password" }); // route doesn't exist yet
        } else {
          navigate({ to: "/dashboard" });
        }
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.data?.requiresSetup) {
          navigate({ to: "/setup-account", search: { email } });
          return;
        }
        const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
        setError(message ?? "Login failed");
      })
      .finally(() => setLoading(false));
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

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white transition hover:bg-evergreen-deep disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}