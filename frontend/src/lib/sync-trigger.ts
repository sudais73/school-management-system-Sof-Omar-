import { runSync } from "./sync-engine";

let started = false;

export function startSyncTrigger() {
  if (started) return;
  started = true;

  window.addEventListener("online", () => runSync());

  // Also try periodically in case the 'online' event doesn't fire reliably
  // on some devices/browsers — cheap safety net.
  setInterval(() => runSync(), 30_000);

  // And try once immediately, in case items were already queued from a
  // previous session and connectivity is back before this even mounts.
  runSync();
}