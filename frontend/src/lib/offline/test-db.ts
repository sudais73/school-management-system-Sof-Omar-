import { offlineDB } from "./db";

export async function testOfflineDatabase() {
  await offlineDB.classes.put({
    id: "test-class-1",
    name: "Grade 8A",
    updatedAt: new Date().toISOString(),
  });

  const classes = await offlineDB.classes.toArray();

  console.log("✅ IndexedDB test successful");
  console.log("📦 Number of classes:", classes.length);
  console.log("📚 Classes:", JSON.stringify(classes, null, 2));
}