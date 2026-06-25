import { useAuthStore } from "@/lib/store/authStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const org = useAuthStore((s) => s.org);
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isStaff = useAuthStore((s) => s.isStaff);
  const isViewer = useAuthStore((s) => s.isViewer);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return {
    user,
    org,
    token,
    hydrated,
    isAuthenticated: !!token && !!user,
    isAdmin: isAdmin(),
    isStaff: isStaff(),
    isViewer: isViewer(),
    clearAuth,
  };
}
