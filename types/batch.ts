export interface Batch {
  id: string;
  itemId: string;
  quantity: number;
  expiryDate: string | null;
}

export interface ExpiringBatch {
  id: string;
  itemId: string;
  itemName: string;
  itemSku: string | null;
  quantity: number;
  expiryDate: string;
  daysRemaining: number;
}
