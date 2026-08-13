import type { Request, Response } from "express";
import * as service from "./conversations.service";

export async function listConversationsHandler(req: Request, res: Response) {
  const userId = req.user!.userId;
  const conversations = await service.getConversationsForUser(userId);
  const withUnread = await Promise.all(
    conversations.map(async (c) => ({ ...c, unreadCount: await service.getUnreadCount(c.id, userId) }))
  );
  res.status(200).json({ conversations: withUnread, currentUserId: userId });
}

export async function getConversationHandler(req: Request, res: Response) {
  try {
    const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await service.getConversationDetail(conversationId, req.user!.userId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}

export async function createConversationHandler(req: Request, res: Response) {
  const { participantIds, type, name } = req.body;
  if (!participantIds?.length || !type) return res.status(400).json({ message: "participantIds and type are required" });

  try {
    const conv = await service.startConversation(req.user!.userId, req.user!.role, participantIds, type, name);
    res.status(201).json({ conversation: conv });
  } catch (err: any) {
    res.status(403).json({ message: err.message });
  }
}

export async function sendMessageHandler(req: Request, res: Response) {
  const { body } = req.body;
  if (!body?.trim()) return res.status(400).json({ message: "Message body is required" });

  const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const message = await service.sendMessage(conversationId, req.user!.userId, body.trim());
  res.status(201).json({ message });
}

export async function listContactsHandler(req: Request, res: Response) {
  const contacts = await service.getEligibleContacts(req.user!.userId, req.user!.role);
  res.status(200).json({ contacts });
}