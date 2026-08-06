import { useState } from "react";
import { X } from "lucide-react";
import { createSubjectRequest } from "../services/subjects.api";

type AddSubjectModalProps = {
  classId: string;
  open: boolean;
  onClose: () => void;
};

export function AddSubjectModal({ classId, open, onClose }: AddSubjectModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createSubjectRequest(classId, name);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to add subject");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-ink">Add subject</h2>
          <button onClick={onClose} className="text-ulead-slate hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="mb-1.5 block text-sm font-medium text-ink">Subject name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mathematics"
            autoFocus
            required
            className="mb-4 w-full rounded-lg border border-ulead-line px-3.5 py-2.5 text-sm outline-none focus:border-evergreen focus:ring-2 focus:ring-evergreen/15"
          />

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add subject"}
          </button>
        </form>
      </div>
    </div>
  );
}