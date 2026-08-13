import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { fetchContacts, createConversation } from "../services/messages.api";
import type { Contact } from "@/types/message";

export function NewConversationModal({ onClose, onCreated }: { onClose: () => void; onCreated: (conversationId: string) => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts().then((c) => { setContacts(c); setLoading(false); });
  }, []);

  const filtered = contacts.filter((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

  async function handlePick(contact: Contact) {
    setCreatingId(contact.id);
    try {
      const conv = await createConversation([contact.id], "DIRECT");
      onCreated(conv.id);
    } finally {
      setCreatingId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex max-h-[80vh] w-full max-w-sm flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-serif text-lg font-bold text-ink">New message</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="border-b px-5 py-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ulead-slate" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search people..." className="w-full rounded-lg border border-ulead-line py-2 pl-9 pr-3 text-sm outline-none focus:border-evergreen" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-5 text-sm text-ulead-slate">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="p-5 text-sm text-ulead-slate">No one matches.</p>
          ) : (
            filtered.map((c) => (
              <button key={c.id} onClick={() => handlePick(c)} disabled={!!creatingId} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-chalk disabled:opacity-50">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-evergreen/10 text-sm font-semibold text-evergreen-deep">{c.fullName.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium text-ink">{c.fullName}</p>
                  <p className="text-xs text-ulead-slate">{c.role.replace("_", " ")}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}