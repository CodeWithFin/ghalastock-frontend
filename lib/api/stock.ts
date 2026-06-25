import apiClient, { unwrap } from "./client";
import type { ExpiringBatch } from "@/types/batch";
import type {
  FEFOPreviewLine,
  StockInPayload,
  StockOutPayload,
  Transaction,
} from "@/types/transaction";
import {
  previewToFEFOLine,
  toExpiringBatch,
  toTransaction,
} from "./transform";
import { transactionsApi } from "./transactions";

export const stockApi = {
  stockIn: async (payload: StockInPayload) => {
    const res = await apiClient.post("/stock/in", {
      items: payload.lines.map((line) => ({
        itemId: line.itemId,
        quantity: line.quantity,
        expiryDate: line.expiryDate ?? null,
        notes: line.notes ?? undefined,
      })),
      transactionDate: payload.transactionDate,
      globalNotes: payload.notes ?? undefined,
    });
    const rows = unwrap(res) as Record<string, unknown>[];
    return rows.map((row) => toTransaction(row));
  },

  stockOut: async (payload: StockOutPayload) => {
    const res = await apiClient.post("/stock/out", {
      shopId: payload.shopId,
      items: payload.lines.map((line) => ({
        itemId: line.itemId,
        quantity: line.quantity,
        notes: line.notes ?? undefined,
      })),
      transactionDate: payload.transactionDate,
      globalNotes: payload.notes ?? undefined,
    });
    const rows = unwrap(res) as Record<string, unknown>[];
    return rows.map((row) => toTransaction(row));
  },

  previewOut: async (lines: { itemId: string; quantity: number }[]) => {
    const previews = await Promise.all(
      lines
        .filter((l) => l.itemId && l.quantity > 0)
        .map(async (line) => {
          try {
            const res = await apiClient.get("/stock/out/preview", {
              params: { itemId: line.itemId, quantity: line.quantity },
            });
            return previewToFEFOLine(
              line.itemId,
              line.quantity,
              unwrap(res) as Record<string, unknown>
            );
          } catch {
            return {
              itemId: line.itemId,
              itemName: "",
              quantity: line.quantity,
              sufficient: false,
              batches: [],
            } satisfies FEFOPreviewLine;
          }
        })
    );
    return previews;
  },

  getExpiring: async (params: { days?: number; search?: string } = {}) => {
    const res = await apiClient.get("/stock/expiring", { params });
    const rows = unwrap(res) as Record<string, unknown>[];
    return {
      batches: rows.map((row) => toExpiringBatch(row)),
      meta: res.data.meta,
    };
  },

  getRecentIn: async (limit = 10) => {
    const { transactions } = await transactionsApi.getAll({ type: "IN", limit });
    return transactions;
  },

  getRecentOut: async (limit = 10) => {
    const { transactions } = await transactionsApi.getAll({ type: "OUT", limit });
    return transactions;
  },
};
