import type { Role } from "@/features/dashboard/menu-items";
import { offlineDb } from "./offline-db";

type AuthState = { token: string | null; role: Role | null };

let state: AuthState = { token: null, role: null };
const listeners = new Set<() => void>();

export function getAuthState() {
  return state;
}

export async function setAuth(next: { token: string; role: string; userId?: string; fullName?: string }) {
  state = { token: next.token, role: next.role };
  listeners.forEach((l) => l());

  if (next.userId && next.fullName) {
    await offlineDb.session.put({ id: "current", userId: next.userId, role: next.role, fullName: next.fullName, cachedAt: Date.now() });
  }
}

export function clearAuth() {
  state = { token: null, role: null };
  listeners.forEach((l) => l());
}

export function subscribeAuth(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}


