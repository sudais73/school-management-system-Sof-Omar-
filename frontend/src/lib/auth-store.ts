import type { Role } from "@/features/dashboard/menu-items";

type AuthState = { token: string | null; role: Role | null };

let state: AuthState = { token: null, role: null };
const listeners = new Set<() => void>();

export function getAuthState() {
  return state;
}

export function setAuth(next: AuthState) {
  state = next;
  listeners.forEach((l) => l());
}

export function clearAuth() {
  state = { token: null, role: null };
  listeners.forEach((l) => l());
}

export function subscribeAuth(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}