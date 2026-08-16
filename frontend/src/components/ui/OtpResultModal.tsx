import { X, KeyRound } from "lucide-react";

export function OtpResultModal({ otp, personName, onClose }: { otp: string; personName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink"><KeyRound size={18} /> New setup code</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100"><X size={16} /></button>
        </div>
        <p className="mb-3 text-sm text-ulead-slate">Share this with {personName} so they can finish setting up their account:</p>
        <p className="rounded-lg bg-evergreen/10 px-3 py-2 text-center font-mono text-lg font-semibold tracking-wider text-evergreen-deep">{otp}</p>
        <button onClick={onClose} className="mt-5 w-full rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep">Done</button>
      </div>
    </div>
  );
}