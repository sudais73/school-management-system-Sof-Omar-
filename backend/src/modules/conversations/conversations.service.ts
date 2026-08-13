import prisma  from "@/config/prisma";
import * as repo from "./conversations.repository";
import { pusherServer } from "@/config/pusher";

// Which roles a given role is allowed to start a conversation with.
// PARENT/STUDENT can only reach staff — not each other — keeping messaging
// scoped to legitimate school communication rather than an open social feature.
const ALLOWED_CONTACTS: Record<string, string[]> = {
  SUPER_ADMIN: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"],
  ADMIN: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"],
  TEACHER: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"],
  PARENT: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
  STUDENT: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
};

export async function getConversationsForUser(userId: string) {
  const conversations = await repo.findUserConversations(userId);

  return conversations.map((conv) => {
    const me = conv.participants.find((p) => p.userId === userId)!;
    const others = conv.participants.filter((p) => p.userId !== userId);
    const lastMessage = conv.messages[0] ?? null;

    const unreadCount = 0; // computed properly below via a real count query — placeholder replaced next
    return {
      id: conv.id,
      type: conv.type,
      name: conv.type === "GROUP" ? conv.name : others[0]?.user.fullName ?? "Unknown",
      lastMessage: lastMessage ? { body: lastMessage.body, createdAt: lastMessage.createdAt, senderName: lastMessage.sender.fullName } : null,
      otherParticipants: others.map((p) => ({ id: p.user.id, name: p.user.fullName, role: p.user.role })),
      myLastReadAt: me.lastReadAt,
    };
  });
}

export async function getUnreadCount(conversationId: string, userId: string) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!participant) return 0;
  return prisma.message.count({
    where: { conversationId, senderId: { not: userId }, createdAt: { gt: participant.lastReadAt } },
  });
}

export async function getConversationDetail(conversationId: string, userId: string) {
  const conv = await repo.findConversationById(conversationId);
  if (!conv) throw new Error("Conversation not found");

  const isParticipant = conv.participants.some((p) => p.userId === userId);
  if (!isParticipant) throw new Error("Not a participant in this conversation");

  const otherParticipants = conv.participants.filter((p) => p.userId !== userId);

  const messages = conv.messages.map((m) => {
    const isMe = m.senderId === userId;
    // "Seen" = every other participant's lastReadAt is after this message's createdAt
    const isSeen = isMe && otherParticipants.every((p) => p.lastReadAt > m.createdAt);
    return { id: m.id, body: m.body, createdAt: m.createdAt, senderId: m.senderId, sender: m.sender, isMe, isSeen };
  });

  await repo.markRead(conversationId, userId);

  // Tell everyone else in this conversation that this user's read position moved
  await pusherServer.trigger(`conversation-${conversationId}`, "messages-seen", {
    seenByUserId: userId,
    seenAt: new Date().toISOString(),
  });

  return {
    conversation: {
      id: conv.id,
      type: conv.type,
      name: conv.type === "GROUP" ? conv.name : otherParticipants[0]?.user.fullName ?? "Unknown",
      participants: conv.participants.map((p) => ({ id: p.user.id, name: p.user.fullName, role: p.user.role })),
    },
    messages,
    currentUserId: userId,
  };
}

export async function startConversation(createdById: string, creatorRole: string, participantIds: string[], type: "DIRECT" | "GROUP", name?: string) {
  const targets = await prisma.user.findMany({ where: { id: { in: participantIds } } });
  const allowed = ALLOWED_CONTACTS[creatorRole] ?? [];
  if (targets.some((t) => !allowed.includes(t.role))) {
    throw new Error("You're not allowed to message one or more of the selected people");
  }

  if (type === "DIRECT") {
    const existing = await repo.findDirectConversation(createdById, participantIds[0]);
    if (existing) return existing;
  }

  return repo.createConversation({ type, name, createdById, participantIds: [createdById, ...participantIds] });
}

export async function sendMessage(conversationId: string, senderId: string, body: string) {
  const message = await repo.createMessage(conversationId, senderId, body);

  await pusherServer.trigger(`conversation-${conversationId}`, "new-message", message);

  const conv = await repo.findConversationById(conversationId);
  const others = conv!.participants.filter((p) => p.userId !== senderId);
  await Promise.all(others.map((p) => pusherServer.trigger(`user-${p.userId}`, "conversation-updated", {})));

  return message;
}

export async function getEligibleContacts(userId: string, role: string) {
  const allowed = ALLOWED_CONTACTS[role] ?? [];
  return prisma.user.findMany({
    where: { role: { in: allowed as any }, id: { not: userId } },
    select: { id: true, fullName: true, role: true },
    orderBy: { fullName: "asc" },
  });
}