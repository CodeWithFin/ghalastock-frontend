export interface Transaction {
  id: string;
  orgId: string;
  itemId: string;
  itemName: string;
  itemSku: string | null;
  itemUnit: string;
  type: "IN" | "OUT";
  quantity: number;
  shopId: string | null;
  shopName: string | null;
  notes: string | null;
  transactionDate: string;
  createdAt: string;
  createdBy: string | null;
  createdByEmail?: string | null;
  expiryDate?: string | null;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: "IN" | "OUT" | "all";
  shopId?: string;
}

export interface StockInLine {
  itemId: string;
  quantity: number;
  expiryDate?: string | null;
  notes?: string | null;
}

export interface StockOutLine {
  itemId: string;
  quantity: number;
  notes?: string | null;
}

export interface StockInPayload {
  lines: StockInLine[];
  transactionDate?: string;
  notes?: string | null;
}

export interface StockOutPayload {
  shopId: string;
  lines: StockOutLine[];
  transactionDate?: string;
  notes?: string | null;
}

export interface FEFOPreviewLine {
  itemId: string;
  itemName: string;
  quantity: number;
  batches: {
    batchId: string;
    quantity: number;
    expiryDate: string | null;
  }[];
  sufficient: boolean;
}
