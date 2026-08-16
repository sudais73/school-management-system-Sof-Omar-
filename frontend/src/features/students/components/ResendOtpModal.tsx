import { useState } from "react";
import { X, KeyRound, User, Users } from "lucide-react";
import { apiClient } from "@/lib/api";
import type { StudentListItem } from "@/types/student";

type ResendOtpModalProps = {
  student: StudentListItem;
  onClose: () => void;
};

export function ResendOtpModal({ student, onClose }: ResendOtpModalProps) {
  const [otp, setOtp] = useState<{ code: string; name: string } | null>(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const people = [
    { userId: student.user.id, name: `${student.firstName} ${student.lastName}`, role: "Student", icon: User },
    ...student.parents.map((p) => ({ userId: p.user.id, name: p.user.fullName, role: "Parent", icon: Users })),
  ];

  async function handlePick(userId: string, name: string) {
    setError(null);
    setLoadingUserId(userId);
    try {
      const { data } = await apiClient.post(`/api/auth/regenerate-otp/${userId}`);
      setOtp({ code: data.setupOtp, name });
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to regenerate code");
    } finally {
      setLoadingUserId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
            <KeyRound size={18} /> {otp ? "New setup code" : "Resend setup code"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100"><X size={16} /></button>
        </div>

        {otp ? (
          <>
            <p className="mb-3 text-sm text-ulead-slate">Share this with {otp.name}:</p>
            <p className="rounded-lg bg-evergreen/10 px-3 py-2 text-center font-mono text-lg font-semibold tracking-wider text-evergreen-deep">{otp.code}</p>
            <button onClick={onClose} className="mt-5 w-full rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep">Done</button>
          </>
        ) : (
          <>
            <p className="mb-3 text-sm text-ulead-slate">Who needs a new code?</p>
            <div className="space-y-2">
              {people.map((p) => (
                <button
                  key={p.userId}
                  onClick={() => handlePick(p.userId, p.name)}
                  disabled={!!loadingUserId}
                  className="flex w-full items-center gap-3 rounded-lg border border-ulead-line px-3 py-2.5 text-left transition hover:border-evergreen/40 hover:bg-evergreen/[0.04] disabled:opacity-50"
                >
                  <p.icon size={16} className="text-evergreen-deep" />
                  <div>
                    <p className="text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-ulead-slate">{p.role}</p>
                  </div>
                  {loadingUserId === p.userId && <span className="ml-auto text-xs text-ulead-slate">Sending...</span>}
                </button>
              ))}
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}