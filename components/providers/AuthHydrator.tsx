"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { authApi } from "@/lib/api/auth";

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!token) return;

    authApi
      .getMe()
      .then(({ user, org }) => setAuth(user, org, token))
      .catch(() => clearAuth());
  }, [token, setAuth, clearAuth]);

  return <>{children}</>;
}
