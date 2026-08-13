import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Plus, Send, Users, Loader2, MessageCircle, ChevronLeft, Check, CheckCheck } from "lucide-react";
import { pusherClient } from "@/lib/pusher-client";
import { fetchConversations, fetchConversation, sendMessage } from "@/features/messages/services/messages.api";
import { NewConversationModal } from "@/features/messages/components/NewConversationModal";
import type { ConversationSummary, ActiveConversation, Message } from "@/types/message";

export const Route = createFileRoute("/dashboard/messages")({
  component: MessagesPage,
});

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeConv, setActiveConv] = useState<ActiveConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [openNewModal, setOpenNewModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConvIdRef = useRef<string | null>(null);

  const loadConversations = useCallback(async () => {
    const data = await fetchConversations();
    setConversations(data.conversations);
    setCurrentUserId((prev) => prev ?? data.currentUserId);
    setLoadingConvs(false);
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Personal channel — conversation list updates even for chats not currently open
  useEffect(() => {
    if (!currentUserId) return;
    const channel = pusherClient.subscribe(`user-${currentUserId}`);
    channel.bind("conversation-updated", loadConversations);
    return () => { pusherClient.unsubscribe(`user-${currentUserId}`); };
  }, [currentUserId, loadConversations]);

  useEffect(() => {
    return () => {
      if (activeConvIdRef.current) pusherClient.unsubscribe(`conversation-${activeConvIdRef.current}`);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function openConversation(convId: string) {
    if (activeConvIdRef.current && activeConvIdRef.current !== convId) {
      pusherClient.unsubscribe(`conversation-${activeConvIdRef.current}`);
    }
    setActiveConvId(convId);
    activeConvIdRef.current = convId;
    setShowMobileChat(true);
    setLoadingMessages(true);

    const data = await fetchConversation(convId);
    setMessages(data.messages);
    setActiveConv(data.conversation);
    setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c)));
    setLoadingMessages(false);

    const channel = pusherClient.subscribe(`conversation-${convId}`);

    channel.bind("new-message", (msg: Message & { senderId: string }) => {
      if (activeConvIdRef.current !== convId) return;
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, { ...msg, isMe: msg.senderId === currentUserId }];
      });
    });

    channel.bind("messages-seen", ({ seenAt }: { seenByUserId: string; seenAt: string }) => {
      if (activeConvIdRef.current !== convId) return;
      const seenAtDate = new Date(seenAt);
      setMessages((prev) => prev.map((m) => (m.isMe && !m.isSeen && seenAtDate > new Date(m.createdAt) ? { ...m, isSeen: true } : m)));
    });
  }

  async function handleSend() {
    if (!messageInput.trim() || !activeConvId || sending) return;
    const body = messageInput.trim();
    setMessageInput("");
    setSending(true);
    try {
      const msg = await sendMessage(activeConvId, body);
      setMessages((prev) => (prev.find((m) => m.id === msg.id) ? prev : [...prev, { ...msg, isMe: true }]));
    } catch {
      setMessageInput(body);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleConversationCreated(convId: string) {
    await loadConversations();
    openConversation(convId);
    setOpenNewModal(false);
  }

  const filtered = conversations.filter((c) => (c.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-ulead-line bg-white">
        {/* LEFT PANEL */}
        <div className={`w-full flex-shrink-0 flex-col border-r border-ulead-line md:flex md:w-80 ${showMobileChat ? "hidden" : "flex"}`}>
          <div className="border-b border-ulead-line p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-ink">Messages</h2>
              <button onClick={() => setOpenNewModal(true)} className="rounded-lg bg-evergreen p-2 text-white hover:bg-evergreen-deep"><Plus size={16} /></button>
            </div>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ulead-slate" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations..." className="w-full rounded-lg border border-ulead-line py-2 pl-9 pr-3 text-sm outline-none focus:border-evergreen" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-evergreen" size={22} /></div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <MessageCircle size={36} className="mx-auto mb-3 text-ulead-line" />
                <p className="text-sm text-ulead-slate">No conversations yet</p>
              </div>
            ) : (
              filtered.map((conv) => (
                <button key={conv.id} onClick={() => openConversation(conv.id)} className={`flex w-full items-start gap-3 border-b border-ulead-line px-4 py-3 text-left hover:bg-chalk ${activeConvId === conv.id ? "bg-evergreen/[0.06]" : ""}`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${conv.type === "GROUP" ? "bg-marigold-deep" : "bg-evergreen"}`}>
                    {conv.type === "GROUP" ? <Users size={16} /> : (conv.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`truncate text-sm font-semibold ${conv.unreadCount > 0 ? "text-ink" : "text-ulead-slate"}`}>{conv.name || "Unknown"}</p>
                      {conv.lastMessage && <span className="ml-2 shrink-0 text-xs text-ulead-slate">{formatTime(conv.lastMessage.createdAt)}</span>}
                    </div>
                    <div className="mt-0.5 flex items-center justify-between">
                      <p className="truncate text-xs text-ulead-slate">{conv.lastMessage ? `${conv.lastMessage.senderName}: ${conv.lastMessage.body}` : "No messages yet"}</p>
                      {conv.unreadCount > 0 && <span className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-evergreen text-xs font-bold text-white">{conv.unreadCount > 9 ? "9+" : conv.unreadCount}</span>}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className={`flex-1 flex-col md:flex ${!showMobileChat ? "hidden" : "flex"}`}>
          {!activeConvId ? (
            <div className="flex flex-1 flex-col items-center justify-center text-ulead-line">
              <MessageCircle size={56} className="mb-4" />
              <p className="font-medium text-ulead-slate">Select a conversation</p>
            </div>
          ) : (
            <>
              <div className="flex flex-shrink-0 items-center gap-3 border-b border-ulead-line px-5 py-4">
                <button onClick={() => setShowMobileChat(false)} className="rounded p-1 hover:bg-chalk md:hidden"><ChevronLeft size={18} /></button>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${activeConv?.type === "GROUP" ? "bg-marigold-deep" : "bg-evergreen"}`}>
                  {activeConv?.type === "GROUP" ? <Users size={15} /> : (activeConv?.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-ink">{activeConv?.name || "Unknown"}</p>
                  <p className="text-xs text-ulead-slate">{activeConv?.type === "GROUP" ? `${activeConv.participants.length} members` : "Direct message"}</p>
                </div>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {loadingMessages ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-evergreen" size={22} /></div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex max-w-[70%] flex-col gap-1 ${msg.isMe ? "items-end" : "items-start"}`}>
                        {!msg.isMe && activeConv?.type === "GROUP" && <span className="px-1 text-xs text-ulead-slate">{msg.sender.fullName}</span>}
                        <div className={`rounded-2xl px-4 py-2 text-sm ${msg.isMe ? "rounded-br-sm bg-evergreen text-white" : "rounded-bl-sm bg-chalk text-ink"}`}>{msg.body}</div>
                        <div className="flex items-center gap-1 px-1">
                          <span className="text-xs text-ulead-slate">{formatTime(msg.createdAt)}</span>
                          {msg.isMe && (msg.isSeen ? <CheckCheck size={13} className="text-evergreen" /> : <Check size={13} className="text-ulead-slate" />)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex flex-shrink-0 items-end gap-3 border-t border-ulead-line px-4 py-3">
                <textarea value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a message... (Enter to send)" rows={1} className="flex-1 resize-none rounded-xl border border-ulead-line px-4 py-2.5 text-sm outline-none focus:border-evergreen" />
                <button onClick={handleSend} disabled={!messageInput.trim() || sending} className="flex-shrink-0 rounded-xl bg-evergreen p-2.5 text-white hover:bg-evergreen-deep disabled:cursor-not-allowed disabled:opacity-40">
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {openNewModal && <NewConversationModal onClose={() => setOpenNewModal(false)} onCreated={handleConversationCreated} />}
    </>
  );
}