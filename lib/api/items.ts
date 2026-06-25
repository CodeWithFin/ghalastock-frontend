import apiClient, { unwrap } from "./client";
import type { PaginationMeta } from "@/types/api";
import type {
  BatchCreateItem,
  CreateItemPayload,
  Item,
  ItemFilters,
  UpdateItemPayload,
} from "@/types/item";

export const itemsApi = {
  getAll: async (filters: ItemFilters = {}) => {
    const res = await apiClient.get<{
      data: Item[];
      meta?: PaginationMeta;
    }>("/items", { params: filters });
    return { items: unwrap(res), meta: res.data.meta };
  },

  getById: async (id: string) => {
    const res = await apiClient.get<{ data: Item }>(`/items/${id}`);
    return unwrap(res);
  },

  create: async (payload: CreateItemPayload) => {
    const res = await apiClient.post<{ data: Item }>("/items", payload);
    return unwrap(res);
  },

  createBatch: async (items: BatchCreateItem[]) => {
    const res = await apiClient.post<{ data: Item[] }>("/items/batch", {
      items,
    });
    return unwrap(res);
  },

  update: async (id: string, payload: UpdateItemPayload) => {
    const res = await apiClient.patch<{ data: Item }>(`/items/${id}`, payload);
    return unwrap(res);
  },

  delete: async (id: string) => {
    await apiClient.delete(`/items/${id}`);
  },

  getCategories: async () => {
    const res = await apiClient.get<{ data: string[] }>("/items/categories");
    return unwrap(res);
  },
};
