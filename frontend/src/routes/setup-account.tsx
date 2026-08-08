import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { AuthField } from "@/features/auth/components/auth-field";
import { apiClient } from "@/lib/api";

export const Route = createFileRoute("/setup-account")({
  component: SetupAccountPage,
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === "string" ? search.email : "",
  }),
});

function SetupAccountPage() {
  const navigate = useNavigate();
  const { email: prefilledEmail } = useSearch({ from: "/setup-account" });

  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    apiClient
      .post("/auth/setup-account", { email, otp, newPassword })
      .then(() => setDone(true))
      .catch((err) => {
        const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
        setError(message ?? "Setup failed");
      })
      .finally(() => setLoading(false));
  }

  if (done) {
    return (
      <AuthLayout>
        <div className="mb-8">
          <h1 className="mb-2 font-serif text-2xl font-semibold text-ink">Account ready</h1>
          <p className="text-sm text-ulead-slate">Your password is set — you can log in now.</p>
        </div>
        <button
          onClick={() => navigate({ to: "/login" })}
          className="w-full rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white transition hover:bg-evergreen-deep"
        >
          Go to login
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="mb-2 font-serif text-2xl font-semibold text-ink">Set up your account</h1>
        <p className="text-sm text-ulead-slate">Enter the setup code your administrator gave you.</p>
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
          id="otp"
          type="text"
          label="Setup code"
          placeholder="6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <AuthField
          id="newPassword"
          type="password"
          label="New password"
          placeholder="At least 8 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <AuthField
          id="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white transition hover:bg-evergreen-deep disabled:opacity-60"
        >
          {loading ? "Setting up..." : "Set password"}
        </button>
      </form>
    </AuthLayout>
  );
}