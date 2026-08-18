export type AnnouncementCategory = "GENERAL" | "ACADEMIC" | "EVENT" | "FEE" | "EMERGENCY";
export type AnnouncementAudience = "ALL" | "STUDENTS" | "PARENTS" | "TEACHERS";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  audience: AnnouncementAudience;
  classId: string | null;
  class: { className: string } | null;
  pinned: boolean;
  createdAt: string;
  author: { id: string; fullName: string; role: string };
};