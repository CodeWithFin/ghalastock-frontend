export interface User {
  id: string;
  orgId: string;
  email: string;
  name?: string;
  role: "admin" | "staff" | "viewer";
  isActive: boolean;
  createdAt: string;
}

export interface Org {
  id: string;
  name: string;
  slug: string;
  email: string;
  plan: "free" | "pro";
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  org: Org;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  orgName: string;
  name: string;
  email: string;
  password: string;
}

export interface AcceptInvitePayload {
  token: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
