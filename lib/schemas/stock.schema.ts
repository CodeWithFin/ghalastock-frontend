import { z } from "zod";

export const stockInLineSchema = z.object({
  itemId: z.string().min(1, "Select an item"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  expiryDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const stockInSchema = z.object({
  lines: z.array(stockInLineSchema).min(1, "Add at least one item"),
  transactionDate: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export const stockOutLineSchema = z.object({
  itemId: z.string().min(1, "Select an item"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional().nullable(),
});

export const stockOutSchema = z.object({
  shopId: z.string().min(1, "Select a shop"),
  lines: z.array(stockOutLineSchema).min(1, "Add at least one item"),
  transactionDate: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export type StockInFormData = z.infer<typeof stockInSchema>;
export type StockOutFormData = z.infer<typeof stockOutSchema>;
