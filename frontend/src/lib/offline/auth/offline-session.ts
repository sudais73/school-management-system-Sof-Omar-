import { offlineDb, type OfflineSession } from "../db";

export async function saveOfflineSession(
  session: Omit<OfflineSession, "id">
) {
  await offlineDb.session.put({
    id: "current",
    ...session,
  });
}

export async function getOfflineSession() {
  return offlineDb.session.get("current");
}

export async function hasOfflineSession() {
  const session = await getOfflineSession();

  return Boolean(session);
}

export async function clearOfflineSession() {
  await offlineDb.session.delete("current");
}