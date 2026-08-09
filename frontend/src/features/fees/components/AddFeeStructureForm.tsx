import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { createStructure } from "../services/fees.api";

type FormItem = { name: string; amount: number };

type Props = {
  classId: string;
  session: string;
  term: string;
  onClose: () => void;
  onSaved: () => void;
};

export function AddFeeStructureForm({ classId, session, term, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<FormItem[]>([{ name: "", amount: 0 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  function updateItem(index: number, patch: Partial<FormItem>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  async function handleSave() {
    setError(null);
    if (!name.trim() || !dueDate) return setError("Name and due date are required");
    if (items.some((i) => !i.name.trim() || i.amount <= 0)) return setError("Every item needs a name and an amount above 0");

    setSaving(true);
    try {
      await createStructure({ classId, session, term, name: name.trim(), description: description.trim() || undefined, dueDate, items });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-5 rounded-2xl border border-marigold/30 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-base font-semibold text-ink">New payment</h3>
        <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-chalk"><X size={16} /></button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold text-ulead-slate">Payment name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Registration & Books" className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ulead-slate">Due date *</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen" />
        </div>
        <div className="sm:col-span-3">
          <label className="mb-1.5 block text-xs font-semibold text-ulead-slate">Description (optional)</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen" />
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold text-ulead-slate">Fee items</label>
          <button onClick={() => setItems((prev) => [...prev, { name: "", amount: 0 }])} className="flex items-center gap-1 text-xs font-semibold text-evergreen-deep hover:underline">
            <Plus size={13} /> Add item
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={item.name} onChange={(e) => updateItem(i, { name: e.target.value })} placeholder="e.g. Tuition" className="flex-1 rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen" />
              <input type="number" value={item.amount || ""} onChange={(e) => updateItem(i, { amount: Number(e.target.value) })} placeholder="0" className="w-32 rounded-lg border border-ulead-line px-3 py-2 text-sm outline-none focus:border-evergreen" />
              {items.length > 1 && (
                <button onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))} className="rounded-lg p-2 text-red-400 hover:bg-red-50">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-evergreen/[0.06] px-3 py-2">
          <span className="text-sm font-semibold text-evergreen-deep">Total per student</span>
          <span className="font-mono text-base font-bold text-evergreen-deep">Br {total.toLocaleString()}</span>
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button onClick={onClose} className="rounded-lg border border-ulead-line px-4 py-2 text-sm font-semibold text-ink hover:bg-chalk">Cancel</button>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-evergreen px-5 py-2 text-sm font-semibold text-white hover:bg-evergreen-deep disabled:opacity-60">
          <Save size={15} />
          {saving ? "Saving..." : "Save & generate fee records"}
        </button>
      </div>
    </div>
  );
}