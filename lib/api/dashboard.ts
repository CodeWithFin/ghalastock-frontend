import apiClient, { unwrap } from "./client";
import type { Transaction } from "@/types/transaction";
import type { Item } from "@/types/item";
import { buildStockMovement, toExpiringBatch, toTransaction } from "./transform";
import { itemsApi } from "./items";
import { transactionsApi } from "./transactions";

export interface DashboardSummary {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringIn30Days: number;
  stockMovement: {
    date: string;
    in: number;
    out: number;
  }[];
  lowStockList: Pick<Item, "id" | "name" | "totalStock" | "minStock" | "unit">[];
  recentTransactions: Transaction[];
  expiryAlerts: {
    id: string;
    itemName: string;
    itemSku: string | null;
    quantity: number;
    expiryDate: string;
    daysRemaining: number;
  }[];
}

interface BackendDashboardSummary {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  expiringIn30Days: number;
  recentTransactions?: Record<string, unknown>[];
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const res = await apiClient.get("/dashboard/summary");
    const raw = unwrap(res) as BackendDashboardSummary;

    const [lowStockResult, expiringResult, movementResult] = await Promise.all([
      itemsApi.getAll({ status: "low", limit: 10 }),
      apiClient.get("/stock/expiring", { params: { days: 30 } }),
      transactionsApi.getAll({ limit: 200 }),
    ]);

    const expiryRows = (unwrap(expiringResult) as Record<string, unknown>[]).map(
      (row) => toExpiringBatch(row)
    );

    const recentFromApi = (raw.recentTransactions ?? []).map((row) =>
      toTransaction(row)
    );

    const movementTxs = movementResult.transactions as Transaction[];

    return {
      totalItems: raw.totalItems ?? 0,
      lowStockItems: raw.lowStockCount ?? 0,
      outOfStockItems: raw.outOfStockCount ?? 0,
      expiringIn30Days: raw.expiringIn30Days ?? 0,
      stockMovement: buildStockMovement(movementTxs),
      lowStockList: lowStockResult.items.map((item) => ({
        id: item.id,
        name: item.name,
        totalStock: item.totalStock,
        minStock: item.minStock,
        unit: item.unit,
      })),
      recentTransactions:
        recentFromApi.length > 0
          ? recentFromApi.slice(0, 10)
          : movementTxs.slice(0, 10),
      expiryAlerts: expiryRows.slice(0, 10).map((batch) => ({
        id: batch.id,
        itemName: batch.itemName,
        itemSku: batch.itemSku,
        quantity: batch.quantity,
        expiryDate: batch.expiryDate,
        daysRemaining: batch.daysRemaining,
      })),
    };
  },
};
