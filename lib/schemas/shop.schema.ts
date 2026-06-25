import { z } from "zod";

export const shopSchema = z.object({
  name: z.string().min(1, "Shop name is required"),
  location: z.string().optional().nullable(),
});

export type ShopFormData = z.infer<typeof shopSchema>;
