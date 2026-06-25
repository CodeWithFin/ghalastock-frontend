import apiClient, { unwrap } from "./client";
import type {
  CreateShopPayload,
  Shop,
  UpdateShopPayload,
} from "@/types/shop";

export const shopsApi = {
  getAll: async () => {
    const res = await apiClient.get<{ data: Shop[] }>("/shops");
    return unwrap(res);
  },

  create: async (payload: CreateShopPayload) => {
    const res = await apiClient.post<{ data: Shop }>("/shops", payload);
    return unwrap(res);
  },

  update: async (id: string, payload: UpdateShopPayload) => {
    const res = await apiClient.patch<{ data: Shop }>(`/shops/${id}`, payload);
    return unwrap(res);
  },

  delete: async (id: string) => {
    await apiClient.delete(`/shops/${id}`);
  },
};
