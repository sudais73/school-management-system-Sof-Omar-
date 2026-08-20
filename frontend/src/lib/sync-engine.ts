import { offlineDb } from "./offline-db";
import { apiClient } from "./api";

let syncing = false;

export async function runSync() {
  if (syncing || !navigator.onLine) return;
  syncing = true;

  try {
    const pendingAttendance = await offlineDb.attendanceQueue.where("status").anyOf("pending", "failed").toArray();
    for (const item of pendingAttendance) {
      await offlineDb.attendanceQueue.update(item.localId, { status: "syncing" });
      try {
        await apiClient.post("/api/teacher/attendance", { classId: item.classId, date: item.date, records: item.records });
        await offlineDb.attendanceQueue.delete(item.localId); // success — remove from queue entirely
      } catch (err: any) {
        await offlineDb.attendanceQueue.update(item.localId, {
          status: "failed",
          lastError: err.response?.data?.message ?? "Sync failed",
        });
      }
    }

    const pendingMarks = await offlineDb.marksQueue.where("status").anyOf("pending", "failed").toArray();
    for (const item of pendingMarks) {
      await offlineDb.marksQueue.update(item.localId, { status: "syncing" });
      try {
        await apiClient.post("/api/teacher/marks", { componentId: item.componentId, marks: item.marks, action: item.action });
        await offlineDb.marksQueue.delete(item.localId);
      } catch (err: any) {
        await offlineDb.marksQueue.update(item.localId, {
          status: "failed",
          lastError: err.response?.data?.message ?? "Sync failed",
        });
      }
    }
  } finally {
    syncing = false;
  }
}