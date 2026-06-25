import apiClient, { unwrap } from "./client";
import type { Transaction } from "@/types/transaction";
import type { Item } from "@/types/item";

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

export const dashboardApi = {
  getSummary: async () => {
    const res = await apiClient.get<{ data: DashboardSummary }>(
      "/dashboard/summary"
    );
    return unwrap(res);
  },
};
