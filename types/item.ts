import type { Batch } from "./batch";

export interface Item {
  id: string;
  orgId: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  category: string | null;
  unit: string;
  price: number | null;
  minStock: number;
  totalStock: number;
  earliestExpiry: string | null;
  batches: Batch[];
  createdAt: string;
  updatedAt: string;
}

export interface ItemFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: "all" | "ok" | "low" | "out";
  barcode?: string;
}

export interface CreateItemPayload {
  name: string;
  sku?: string | null;
  barcode?: string | null;
  category?: string | null;
  unit: string;
  price?: number | null;
  minStock?: number;
}

export interface UpdateItemPayload extends Partial<CreateItemPayload> {}

export interface BatchCreateItem {
  name: string;
  sku?: string | null;
  barcode?: string | null;
  category?: string | null;
  unit: string;
  price?: number | null;
  minStock?: number;
}
