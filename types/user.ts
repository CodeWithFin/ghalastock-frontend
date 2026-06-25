export type { User } from "./auth";

export interface Invite {
  id: string;
  orgId: string;
  email: string;
  role: "staff" | "viewer";
  expiresAt: string;
  createdAt: string;
}

export interface CreateInvitePayload {
  email: string;
  role: "staff" | "viewer";
}

export interface UpdateUserPayload {
  role?: "admin" | "staff" | "viewer";
  isActive?: boolean;
}
