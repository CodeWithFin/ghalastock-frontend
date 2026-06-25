import apiClient, { unwrap } from "./client";
import type { PaginationMeta } from "@/types/api";
import type {
  BatchCreateItem,
  CreateItemPayload,
  Item,
  ItemFilters,
  UpdateItemPayload,
} from "@/types/item";
import { itemToApiBody, toItem } from "./transform";

function buildItemParams(filters: ItemFilters = {}) {
  const params: Record<string, string | number> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.barcode) params.barcode = filters.barcode;
  if (filters.status && filters.status !== "all") params.status = filters.status;
  return params;
}

export const itemsApi = {
  getAll: async (filters: ItemFilters = {}) => {
    const res = await apiClient.get("/items", { params: buildItemParams(filters) });
    const rows = unwrap(res) as Record<string, unknown>[];
    return {
      items: rows.map((row) => toItem(row)),
      meta: res.data.meta as PaginationMeta | undefined,
    };
  },

  getById: async (id: string) => {
    const res = await apiClient.get(`/items/${id}`);
    return toItem(unwrap(res) as Record<string, unknown>);
  },

  create: async (payload: CreateItemPayload) => {
    const res = await apiClient.post("/items", itemToApiBody(payload));
    return toItem(unwrap(res) as Record<string, unknown>);
  },

  createBatch: async (items: BatchCreateItem[]) => {
    const res = await apiClient.post("/items/batch", {
      items: items.map((item) => itemToApiBody(item)),
    });
    const data = unwrap(res) as {
      items?: Record<string, unknown>[];
    };
    const created = data.items ?? [];
    return created.map((row) => toItem(row));
  },

  update: async (id: string, payload: UpdateItemPayload) => {
    const res = await apiClient.patch(`/items/${id}`, itemToApiBody(payload));
    return toItem(unwrap(res) as Record<string, unknown>);
  },

  delete: async (id: string) => {
    await apiClient.delete(`/items/${id}`);
  },

  getCategories: async () => {
    const { items } = await itemsApi.getAll({ limit: 100 });
    const categories = new Set<string>();
    for (const item of items) {
      if (item.category) categories.add(item.category);
    }
    return Array.from(categories).sort();
  },
};
