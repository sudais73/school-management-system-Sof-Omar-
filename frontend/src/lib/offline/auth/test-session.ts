import {
  saveOfflineSession,
  getOfflineSession,
  clearOfflineSession,
} from "./offline-session";

export async function testOfflineSession() {
  await saveOfflineSession({
    userId: "test-user-123",
    role: "TEACHER",
    fullName: "Test Teacher",
    cachedAt: Date.now(),
  });

const session = await getOfflineSession();

console.log(session);

  console.log("🔐 Offline session:", session);
}