import apiClient, { unwrap } from "./client";
import type { PaginationMeta } from "@/types/api";
import type { Transaction, TransactionFilters } from "@/types/transaction";
import { toTransaction } from "./transform";

function buildParams(filters: TransactionFilters = {}) {
  const params: Record<string, string | number> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.shopId) params.shopId = filters.shopId;
  if (filters.type && filters.type !== "all") params.type = filters.type;
  return params;
}

export const transactionsApi = {
  getAll: async (filters: TransactionFilters = {}) => {
    const res = await apiClient.get("/transactions", {
      params: buildParams(filters),
    });
    let transactions = (unwrap(res) as Record<string, unknown>[]).map((row) =>
      toTransaction(row)
    );

    if (filters.search) {
      const q = filters.search.toLowerCase();
      transactions = transactions.filter(
        (tx) =>
          tx.itemName.toLowerCase().includes(q) ||
          (tx.itemSku?.toLowerCase().includes(q) ?? false)
      );
    }

    return {
      transactions,
      meta: res.data.meta as PaginationMeta | undefined,
    };
  },

  undo: async (id: string) => {
    const res = await apiClient.delete(`/transactions/${id}`);
    return toTransaction(unwrap(res) as Record<string, unknown>);
  },
};
