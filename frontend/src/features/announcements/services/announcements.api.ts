import { apiClient } from "@/lib/api";
import type { Announcement, AnnouncementCategory, AnnouncementAudience } from "@/types/announcement";

export async function fetchAnnouncements() {
  const { data } = await apiClient.get<{ announcements: Announcement[] }>("/api/announcements");
  return data.announcements;
}

export async function createAnnouncement(payload: {
  title: string; body: string; category: AnnouncementCategory; audience: AnnouncementAudience;
  classId?: string; pinned: boolean;
}) {
  const { data } = await apiClient.post<{ announcement: Announcement }>("/api/announcements", payload);
  return data.announcement;
}