import { useState } from "react";
import { X, Pin } from "lucide-react";
import { createAnnouncement } from "../services/announcements.api";
import type { AnnouncementCategory, AnnouncementAudience } from "@/types/announcement";
import type { SchoolClass } from "@/types/class";

type Props = { classes: SchoolClass[]; onClose: () => void; onCreated: () => void };

const CATEGORIES: AnnouncementCategory[] = ["GENERAL", "ACADEMIC", "EVENT", "FEE", "EMERGENCY"];
const AUDIENCES: { value: AnnouncementAudience; label: string }[] = [
  { value: "ALL", label: "Everyone" },
  { value: "STUDENTS", label: "Students" },
  { value: "PARENTS", label: "Parents" },
  { value: "TEACHERS", label: "Teachers" },
];

export function CreateAnnouncementForm({ classes, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory>("GENERAL");
  const [audience, setAudience] = useState<AnnouncementAudience>("ALL");
  const [classId, setClassId] = useState("");
  const [pinned, setPinned] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsClass = audience === "STUDENTS" || audience === "PARENTS";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return setError("Title and body are required");

    setSaving(true);
    setError(null);
    try {
      await createAnnouncement({ title: title.trim(), body: body.trim(), category, audience, classId: needsClass && classId ? classId : undefined, pinned });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to post announcement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-ink">New announcement</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="mb-1.5 block text-sm font-medium text-ink">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mb-4 w-full rounded-lg border border-ulead-line px-3.5 py-2.5 text-sm outline-none focus:border-evergreen" placeholder="Mid-term exam schedule" />

          <label className="mb-1.5 block text-sm font-medium text-ink">Message</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="mb-4 w-full resize-none rounded-lg border border-ulead-line px-3.5 py-2.5 text-sm outline-none focus:border-evergreen" />

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as AnnouncementCategory)} className="w-full rounded-lg border border-ulead-line px-3 py-2.5 text-sm outline-none focus:border-evergreen">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Audience</label>
              <select value={audience} onChange={(e) => { setAudience(e.target.value as AnnouncementAudience); setClassId(""); }} className="w-full rounded-lg border border-ulead-line px-3 py-2.5 text-sm outline-none focus:border-evergreen">
                {AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
          </div>

          {needsClass && (
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-ink">Class (leave blank for all {audience.toLowerCase()})</label>
              <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full rounded-lg border border-ulead-line px-3 py-2.5 text-sm outline-none focus:border-evergreen">
                <option value="">All classes</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.className}</option>)}
              </select>
            </div>
          )}

          <label className="mb-4 flex items-center gap-2.5 text-sm text-ink">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="accent-marigold" />
            <Pin size={14} /> Pin to top
          </label>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-ulead-line py-2.5 text-sm font-medium text-ink hover:bg-chalk">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep disabled:opacity-60">
              {saving ? "Posting..." : "Post announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}