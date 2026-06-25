import apiClient, { unwrap } from "./client";
import type { Org } from "@/types/auth";

export const orgsApi = {
  getMe: async () => {
    const res = await apiClient.get<{ data: Org }>("/orgs/me");
    return unwrap(res);
  },

  updateMe: async (payload: Partial<Pick<Org, "name" | "email">>) => {
    const res = await apiClient.patch<{ data: Org }>("/orgs/me", payload);
    return unwrap(res);
  },
};
