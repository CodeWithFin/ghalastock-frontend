import apiClient, { unwrap } from "./client";
import type { CreateInvitePayload, Invite } from "@/types/user";
import type { User, UpdateUserPayload } from "@/types/user";
import type { ChangePasswordPayload } from "@/types/auth";
import { toInvite, toTeamUser } from "./transform";

export const usersApi = {
  getAll: async () => {
    const res = await apiClient.get("/users");
    const rows = unwrap(res) as Record<string, unknown>[];
    return rows.map((row) => toTeamUser(row));
  },

  update: async (id: string, payload: UpdateUserPayload) => {
    const body: Record<string, unknown> = {};
    if (payload.role !== undefined) body.role = payload.role;
    if (payload.isActive !== undefined) body.is_active = payload.isActive;
    const res = await apiClient.patch(`/users/${id}`, body);
    return toTeamUser(unwrap(res) as Record<string, unknown>);
  },

  changePassword: async (_payload: ChangePasswordPayload) => {
    throw new Error("Password change is not available yet on the server");
  },
};

export const invitesApi = {
  getAll: async () => {
    const res = await apiClient.get("/invites");
    const rows = unwrap(res) as Record<string, unknown>[];
    return rows.map((row) => toInvite(row));
  },

  create: async (payload: CreateInvitePayload) => {
    const res = await apiClient.post("/invites", payload);
    return toInvite(unwrap(res) as Record<string, unknown>);
  },

  cancel: async (id: string) => {
    await apiClient.delete(`/invites/${id}`);
  },
};
