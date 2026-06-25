import apiClient, { unwrap } from "./client";
import type { CreateInvitePayload, Invite } from "@/types/user";
import type { User, UpdateUserPayload } from "@/types/user";
import type { ChangePasswordPayload } from "@/types/auth";

export const usersApi = {
  getAll: async () => {
    const res = await apiClient.get<{ data: User[] }>("/users");
    return unwrap(res);
  },

  update: async (id: string, payload: UpdateUserPayload) => {
    const res = await apiClient.patch<{ data: User }>(`/users/${id}`, payload);
    return unwrap(res);
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    await apiClient.patch("/users/me/password", payload);
  },
};

export const invitesApi = {
  getAll: async () => {
    const res = await apiClient.get<{ data: Invite[] }>("/invites");
    return unwrap(res);
  },

  create: async (payload: CreateInvitePayload) => {
    const res = await apiClient.post<{ data: Invite }>("/invites", payload);
    return unwrap(res);
  },

  cancel: async (id: string) => {
    await apiClient.delete(`/invites/${id}`);
  },
};
