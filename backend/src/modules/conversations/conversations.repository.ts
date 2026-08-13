import prisma  from "@/config/prisma";

export function findUserConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: { include: { user: { select: { id: true, fullName: true, role: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: { select: { fullName: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function findConversationById(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      participants: { include: { user: { select: { id: true, fullName: true, role: true } } } },
      messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, fullName: true, role: true } } } },
    },
  });
}

export function findDirectConversation(userIdA: string, userIdB: string) {
  return prisma.conversation.findFirst({
    where: {
      type: "DIRECT",
      AND: [
        { participants: { some: { userId: userIdA } } },
        { participants: { some: { userId: userIdB } } },
      ],
    },
  });
}

export function createConversation(data: { type: "DIRECT" | "GROUP"; name?: string; createdById: string; participantIds: string[] }) {
  return prisma.conversation.create({
    data: {
      type: data.type,
      name: data.name,
      createdById: data.createdById,
      participants: { create: data.participantIds.map((userId) => ({ userId })) },
    },
  });
}

export function createMessage(conversationId: string, senderId: string, body: string) {
  return prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: { conversationId, senderId, body },
      include: { sender: { select: { id: true, fullName: true, role: true } } },
    });
    // Bump conversation.updatedAt so the list re-sorts by most recent activity
    await tx.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
    // Sender's own lastReadAt moves forward too — they've obviously "read" their own message
    await tx.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId: senderId } },
      data: { lastReadAt: new Date() },
    });
    return message;
  });
}

export function markRead(conversationId: string, userId: string) {
  return prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: new Date() },
  });
}