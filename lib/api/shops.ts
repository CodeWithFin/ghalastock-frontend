import apiClient, { unwrap } from "./client";
import type {
  CreateShopPayload,
  Shop,
  UpdateShopPayload,
} from "@/types/shop";
import { toShop } from "./transform";

export const shopsApi = {
  getAll: async () => {
    const res = await apiClient.get("/shops");
    const rows = unwrap(res) as Record<string, unknown>[];
    return rows.map((row) => toShop(row));
  },

  create: async (payload: CreateShopPayload) => {
    const res = await apiClient.post("/shops", payload);
    return toShop(unwrap(res) as Record<string, unknown>);
  },

  update: async (id: string, payload: UpdateShopPayload) => {
    const body: Record<string, unknown> = { ...payload };
    if (payload.isActive !== undefined) {
      body.is_active = payload.isActive;
      delete body.isActive;
    }
    const res = await apiClient.patch(`/shops/${id}`, body);
    return toShop(unwrap(res) as Record<string, unknown>);
  },

  delete: async (id: string) => {
    await apiClient.delete(`/shops/${id}`);
  },
};
