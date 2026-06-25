import apiClient, { unwrap } from "./client";
import type { Org } from "@/types/auth";
import { toOrg } from "./transform";

export const orgsApi = {
  getMe: async () => {
    const res = await apiClient.get("/orgs/me");
    return toOrg(unwrap(res) as Record<string, unknown>);
  },

  updateMe: async (payload: Partial<Pick<Org, "name" | "email">>) => {
    const res = await apiClient.patch("/orgs/me", payload);
    return toOrg(unwrap(res) as Record<string, unknown>);
  },
};
