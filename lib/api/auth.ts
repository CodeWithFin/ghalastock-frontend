import apiClient, { unwrap } from "./client";
import type {
  AcceptInvitePayload,
  AuthResponse,
  LoginPayload,
  SignupPayload,
} from "@/types/auth";

export const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await apiClient.post<{ data: AuthResponse }>(
      "/auth/login",
      payload
    );
    return unwrap(res);
  },

  signup: async (payload: SignupPayload) => {
    const res = await apiClient.post<{ data: AuthResponse }>(
      "/auth/signup",
      payload
    );
    return unwrap(res);
  },

  acceptInvite: async (payload: AcceptInvitePayload) => {
    const res = await apiClient.post<{ data: AuthResponse }>(
      "/auth/accept-invite",
      payload
    );
    return unwrap(res);
  },
};
