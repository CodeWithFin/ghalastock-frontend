import { create } from "zustand";
import type { Org, User } from "@/types/auth";

const TOKEN_KEY = "ghala_token";
const AUTH_KEY = "ghala_auth";

interface StoredAuth {
  user: User;
  org: Org;
  token: string;
}

interface AuthState {
  user: User | null;
  org: Org | null;
  token: string | null;
  hydrated: boolean;
  setAuth: (user: User, org: Org, token: string) => void;
  clearAuth: () => void;
  hydrate: () => void;
  isAdmin: () => boolean;
  isStaff: () => boolean;
  isViewer: () => boolean;
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  org: null,
  token: null,
  hydrated: false,

  setAuth: (user, org, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, org, token }));
    setCookie("ghala_token", token);
    set({ user, org, token });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_KEY);
    deleteCookie("ghala_token");
    set({ user: null, org: null, token: null });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        const parsed: StoredAuth = JSON.parse(stored);
        setCookie("ghala_token", parsed.token);
        set({
          user: parsed.user,
          org: parsed.org,
          token: parsed.token,
          hydrated: true,
        });
        return;
      }
    } catch {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ hydrated: true });
  },

  isAdmin: () => get().user?.role === "admin",
  isStaff: () => {
    const role = get().user?.role;
    return role === "admin" || role === "staff";
  },
  isViewer: () => get().user?.role === "viewer",
}));

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return useAuthStore.getState().token ?? localStorage.getItem(TOKEN_KEY);
}
