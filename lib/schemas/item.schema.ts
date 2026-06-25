import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  unit: z.string().min(1, "Unit is required"),
  price: z.coerce.number().min(0).optional().nullable(),
  minStock: z.coerce.number().min(0).default(0),
});

export const batchItemRowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  unit: z.string().min(1, "Unit is required"),
  price: z.coerce.number().min(0).optional().nullable(),
  minStock: z.coerce.number().min(0).default(0),
});

export const batchAddSchema = z.object({
  items: z.array(batchItemRowSchema).min(1, "Add at least one item"),
});

export type ItemFormData = z.infer<typeof itemSchema>;
export type BatchItemRowData = z.infer<typeof batchItemRowSchema>;
export type BatchAddFormData = z.infer<typeof batchAddSchema>;
