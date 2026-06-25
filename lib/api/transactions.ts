import apiClient, { unwrap } from "./client";
import type { PaginationMeta } from "@/types/api";
import type { Transaction, TransactionFilters } from "@/types/transaction";

export const transactionsApi = {
  getAll: async (filters: TransactionFilters = {}) => {
    const res = await apiClient.get<{
      data: Transaction[];
      meta?: PaginationMeta;
    }>("/transactions", { params: filters });
    return { transactions: unwrap(res), meta: res.data.meta };
  },

  undo: async (id: string) => {
    const res = await apiClient.post<{ data: Transaction }>(
      `/transactions/${id}/undo`
    );
    return unwrap(res);
  },
};
