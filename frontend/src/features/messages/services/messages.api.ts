import { apiClient } from "@/lib/api";
import type { ConversationSummary, ActiveConversation, Message, Contact } from "@/types/message";

export async function fetchConversations() {
  const { data } = await apiClient.get<{ conversations: ConversationSummary[]; currentUserId: string }>("/api/conversations");
  return data;
}

export async function fetchContacts() {
  const { data } = await apiClient.get<{ contacts: Contact[] }>("/api/conversations/contacts");
  return data.contacts;
}

export async function fetchConversation(id: string) {
  const { data } = await apiClient.get<{ conversation: ActiveConversation; messages: Message[]; currentUserId: string }>(`/api/conversations/${id}`);
  return data;
}

export async function createConversation(participantIds: string[], type: "DIRECT" | "GROUP", name?: string) {
  const { data } = await apiClient.post<{ conversation: { id: string } }>("/api/conversations", { participantIds, type, name });
  return data.conversation;
}

export async function sendMessage(conversationId: string, body: string) {
  const { data } = await apiClient.post<{ message: Message }>(`/api/conversations/${conversationId}`, { body });
  return data.message;
}