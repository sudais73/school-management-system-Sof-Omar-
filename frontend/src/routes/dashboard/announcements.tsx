import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pin, Megaphone } from "lucide-react";
import { fetchAnnouncements } from "@/features/announcements/services/announcements.api";
import { fetchClasses } from "@/features/classes/services/classes.api";
import { CreateAnnouncementForm } from "@/features/announcements/components/CreateAnnouncementForm";
import { getAuthState } from "@/lib/auth-store";
import type { Announcement } from "@/types/announcement";
import type { SchoolClass } from "@/types/class";

export const Route = createFileRoute("/dashboard/announcements")({
  component: AnnouncementsPage,
});

const categoryStyle: Record<string, string> = {
  GENERAL: "bg-ink/10 text-ink",
  ACADEMIC: "bg-evergreen/10 text-evergreen-deep",
  EVENT: "bg-marigold/15 text-marigold-deep",
  FEE: "bg-orange-100 text-orange-700",
  EMERGENCY: "bg-red-100 text-red-700",
};

function AnnouncementsPage() {
  const { role } = getAuthState();
  const isAdmin = role === "SUPER_ADMIN" || role === "ADMIN";

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  function loadAnnouncements() {
    return fetchAnnouncements().then(setAnnouncements);
  }

  useEffect(() => {
    Promise.all([loadAnnouncements(), isAdmin ? fetchClasses().then(setClasses) : Promise.resolve()]).finally(() => setLoading(false));
  }, [isAdmin]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Announcements</h1>
          <p className="mt-0.5 text-sm text-ulead-slate">School-wide updates, exam schedules, and reminders.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-lg bg-evergreen px-4 py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep">
            <Plus size={16} /> New
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-ulead-slate">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ulead-line bg-chalk-card py-16 text-center text-sm text-ulead-slate">
          <Megaphone size={32} className="mx-auto mb-3 text-ulead-line" />
          No announcements yet.
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className={`rounded-2xl border bg-chalk-card p-5 ${a.pinned ? "border-marigold/40" : "border-ulead-line"}`}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {a.pinned && <Pin size={14} className="text-marigold-deep" />}
                  <h3 className="font-serif text-base font-semibold text-ink">{a.title}</h3>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryStyle[a.category]}`}>{a.category}</span>
              </div>
              <p className="mb-3 whitespace-pre-wrap text-sm text-ulead-slate">{a.body}</p>
              <div className="flex items-center justify-between text-xs text-ulead-slate">
                <span>{a.author.fullName} · {new Date(a.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}</span>
                {(a.audience !== "ALL" || a.class) && (
                  <span className="rounded-full bg-chalk px-2 py-0.5">{a.class ? a.class.className : a.audience}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <CreateAnnouncementForm classes={classes} onClose={() => setShowForm(false)} onCreated={loadAnnouncements} />}
    </div>
  );
}