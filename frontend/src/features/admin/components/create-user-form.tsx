import { useState } from "react";
import { AuthField } from "@/features/auth/components/auth-field";
import { RoleSelect, type UserRole } from "@/features/auth/components/role-select";

/**
 * Used inside the admin dashboard (e.g. a "Create user" modal or /admin/users/new page)
 * once that shell exists. Not a public route — U-Lead has no self-signup. Admin creates
 * every account (teacher, student, parent) here and the system sends them their login
 * details.
 */
export function CreateUserForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wired up once the admin/users API exists.
    // Typical flow: create the record server-side, generate a temporary
    // password or invite link, and email/SMS it to the new user.
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
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
        placeholder="parent@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <RoleSelect value={role} onChange={setRole} />

      <button
        type="submit"
        disabled={!role}
        className="w-full rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white transition hover:bg-evergreen-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        Create account & send login details
      </button>
    </form>
  );
}
