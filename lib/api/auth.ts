import apiClient, { unwrap } from "./client";
import { toOrg, toUser } from "./transform";
import type {
  AcceptInvitePayload,
  AuthResponse,
  LoginPayload,
  SignupPayload,
} from "@/types/auth";

function mapAuthResponse(data: Record<string, unknown>): AuthResponse {
  const user = toUser((data.user as Record<string, unknown>) ?? {});
  const org = toOrg(
    (data.org as Record<string, unknown>) ?? {},
    user.email
  );
  if (!user.orgId) user.orgId = org.id;
  return {
    token: data.token as string,
    user,
    org,
  };
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await apiClient.post("/auth/login", payload);
    return mapAuthResponse(unwrap(res) as Record<string, unknown>);
  },

  signup: async (payload: SignupPayload) => {
    const res = await apiClient.post("/auth/signup", {
      orgName: payload.orgName,
      email: payload.email,
      password: payload.password,
    });
    return mapAuthResponse(unwrap(res) as Record<string, unknown>);
  },

  acceptInvite: async (payload: AcceptInvitePayload) => {
    const res = await apiClient.post("/auth/accept-invite", payload);
    return mapAuthResponse(unwrap(res) as Record<string, unknown>);
  },

  getMe: async () => {
    const res = await apiClient.get("/auth/me");
    const data = unwrap(res) as { user: Record<string, unknown>; org: Record<string, unknown> };
    const user = toUser(data.user);
    const org = toOrg(data.org, user.email);
    if (!user.orgId) user.orgId = org.id;
    return { user, org };
  },
};
