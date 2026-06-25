import apiClient, { unwrap } from "./client";
import type { ExpiringBatch } from "@/types/batch";
import type { PaginationMeta } from "@/types/api";
import type {
  FEFOPreviewLine,
  StockInPayload,
  StockOutPayload,
  Transaction,
} from "@/types/transaction";

export const stockApi = {
  stockIn: async (payload: StockInPayload) => {
    const res = await apiClient.post<{ data: Transaction[] }>(
      "/stock/in",
      payload
    );
    return unwrap(res);
  },

  stockOut: async (payload: StockOutPayload) => {
    const res = await apiClient.post<{ data: Transaction[] }>(
      "/stock/out",
      payload
    );
    return unwrap(res);
  },

  previewOut: async (lines: { itemId: string; quantity: number }[]) => {
    const res = await apiClient.get<{ data: FEFOPreviewLine[] }>(
      "/stock/out/preview",
      { params: { lines: JSON.stringify(lines) } }
    );
    return unwrap(res);
  },

  getExpiring: async (params: { days?: number; search?: string } = {}) => {
    const res = await apiClient.get<{
      data: ExpiringBatch[];
      meta?: PaginationMeta;
    }>("/stock/expiring", { params });
    return { batches: unwrap(res), meta: res.data.meta };
  },

  getRecentIn: async (limit = 10) => {
    const res = await apiClient.get<{ data: Transaction[] }>(
      "/stock/in/recent",
      { params: { limit } }
    );
    return unwrap(res);
  },

  getRecentOut: async (limit = 10) => {
    const res = await apiClient.get<{ data: Transaction[] }>(
      "/stock/out/recent",
      { params: { limit } }
    );
    return unwrap(res);
  },
};
