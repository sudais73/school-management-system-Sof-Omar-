export type ConversationType = "DIRECT" | "GROUP";

export type Contact = { id: string; fullName: string; role: string };

export type ConversationSummary = {
  id: string;
  type: ConversationType;
  name: string;
  lastMessage: { body: string; createdAt: string; senderName: string } | null;
  unreadCount: number;
  otherParticipants: { id: string; name: string; role: string }[];
};

export type Message = {
  id: string;
  body: string;
  createdAt: string;
  isMe: boolean;
  senderId: string;
  sender: { id: string; fullName: string; role: string };
  isSeen: boolean;
};

export type ActiveConversation = {
  id: string;
  type: ConversationType;
  name: string;
  participants: { id: string; name: string; role: string }[];
};