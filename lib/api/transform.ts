import type { Org, User } from "@/types/auth";
import type { Batch, ExpiringBatch } from "@/types/batch";
import type { Item } from "@/types/item";
import type { Shop } from "@/types/shop";
import type { Invite, User as TeamUser } from "@/types/user";
import type { FEFOPreviewLine, Transaction } from "@/types/transaction";
import { daysUntil } from "@/lib/utils/format";

function snakeToCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function toCamel<T>(value: unknown): T {
  if (value === null || value === undefined) return value as T;
  if (Array.isArray(value)) return value.map((v) => toCamel(v)) as T;
  if (typeof value !== "object" || value instanceof Date) return value as T;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, val]) => [
      snakeToCamel(key),
      toCamel(val),
    ])
  ) as T;
}

export function toUser(raw: Record<string, unknown>): User {
  const u = toCamel<User>(raw);
  return {
    ...u,
    orgId: u.orgId ?? (raw.org_id as string) ?? "",
    isActive: u.isActive ?? Boolean(raw.is_active),
    createdAt: u.createdAt ?? (raw.created_at as string) ?? new Date().toISOString(),
  };
}

export function toOrg(raw: Record<string, unknown>, fallbackEmail?: string): Org {
  const o = toCamel<Org>(raw);
  return {
    id: o.id ?? (raw.id as string),
    name: o.name ?? (raw.name as string),
    slug: o.slug ?? (raw.slug as string) ?? "",
    email: o.email ?? (raw.email as string) ?? fallbackEmail ?? "",
    plan: o.plan ?? (raw.plan as Org["plan"]) ?? "free",
    isActive: o.isActive ?? Boolean(raw.is_active ?? true),
    createdAt: o.createdAt ?? (raw.created_at as string) ?? new Date().toISOString(),
  };
}

export function toBatch(raw: Record<string, unknown>): Batch {
  const b = toCamel<Batch>(raw);
  return {
    id: b.id,
    itemId: b.itemId ?? (raw.item_id as string),
    quantity: Number(b.quantity ?? raw.quantity ?? 0),
    expiryDate: b.expiryDate ?? (raw.expiry_date as string | null) ?? null,
  };
}

export function toItem(raw: Record<string, unknown>): Item {
  const i = toCamel<Item>(raw);
  const batchesRaw = raw.batches;
  const batches = Array.isArray(batchesRaw)
    ? batchesRaw.map((b) => toBatch(b as Record<string, unknown>))
    : i.batches ?? [];

  return {
    id: i.id,
    orgId: i.orgId ?? (raw.org_id as string) ?? "",
    name: i.name,
    sku: i.sku ?? null,
    barcode: i.barcode ?? null,
    category: i.category ?? null,
    unit: i.unit ?? "pcs",
    price: i.price != null ? Number(i.price) : null,
    minStock: Number(i.minStock ?? raw.min_stock ?? 0),
    totalStock: Number(i.totalStock ?? raw.total_stock ?? 0),
    earliestExpiry: i.earliestExpiry ?? (raw.earliest_expiry as string | null) ?? null,
    batches,
    createdAt: i.createdAt ?? (raw.created_at as string) ?? "",
    updatedAt: i.updatedAt ?? (raw.updated_at as string) ?? "",
  };
}

export function toTransaction(raw: Record<string, unknown>): Transaction {
  const t = toCamel<Transaction>(raw);
  return {
    id: t.id,
    orgId: t.orgId ?? (raw.org_id as string) ?? "",
    itemId: t.itemId ?? (raw.item_id as string) ?? "",
    itemName: t.itemName ?? (raw.item_name as string) ?? "",
    itemSku: t.itemSku ?? (raw.item_sku as string | null) ?? null,
    itemUnit: t.itemUnit ?? (raw.item_unit as string) ?? "pcs",
    type: (t.type ?? raw.type) as "IN" | "OUT",
    quantity: Number(t.quantity ?? raw.quantity ?? 0),
    shopId: t.shopId ?? (raw.shop_id as string | null) ?? null,
    shopName: t.shopName ?? (raw.shop_name as string | null) ?? null,
    notes: t.notes ?? (raw.notes as string | null) ?? null,
    transactionDate:
      t.transactionDate ??
      (raw.transaction_date as string) ??
      (raw.created_at as string) ??
      "",
    createdAt: t.createdAt ?? (raw.created_at as string) ?? "",
    createdBy: t.createdBy ?? (raw.created_by as string | null) ?? null,
    createdByEmail: t.createdByEmail ?? (raw.created_by_email as string | null) ?? null,
    expiryDate: t.expiryDate ?? null,
  };
}

export function toShop(raw: Record<string, unknown>): Shop {
  const s = toCamel<Shop>(raw);
  return {
    id: s.id,
    orgId: s.orgId ?? (raw.org_id as string) ?? "",
    name: s.name,
    location: s.location ?? null,
    isActive: s.isActive ?? Boolean(raw.is_active ?? true),
    createdAt: s.createdAt ?? (raw.created_at as string) ?? "",
  };
}

export function toInvite(raw: Record<string, unknown>): Invite {
  const inv = toCamel<Invite>(raw);
  return {
    id: inv.id,
    orgId: inv.orgId ?? (raw.org_id as string) ?? "",
    email: inv.email,
    role: inv.role,
    expiresAt: inv.expiresAt ?? (raw.expires_at as string) ?? "",
    createdAt: inv.createdAt ?? (raw.created_at as string) ?? "",
  };
}

export function toTeamUser(raw: Record<string, unknown>): TeamUser {
  const u = toUser(raw);
  return u;
}

export function toExpiringBatch(raw: Record<string, unknown>): ExpiringBatch {
  const expiryDate =
    (raw.expiry_date as string) ?? (raw.expiryDate as string) ?? "";
  return {
    id: raw.id as string,
    itemId: (raw.item_id as string) ?? (raw.itemId as string),
    itemName: (raw.item_name as string) ?? (raw.itemName as string) ?? "",
    itemSku: (raw.sku as string | null) ?? (raw.item_sku as string | null) ?? null,
    quantity: Number(raw.quantity ?? 0),
    expiryDate,
    daysRemaining: daysUntil(expiryDate),
  };
}

export function itemToApiBody(
  payload: Partial<{
    name: string;
    sku?: string | null;
    barcode?: string | null;
    category?: string | null;
    unit?: string;
    price?: number | null;
    minStock?: number;
  }>
) {
  const body: Record<string, unknown> = {};
  if (payload.name !== undefined) body.name = payload.name;
  if (payload.sku !== undefined) body.sku = payload.sku || null;
  if (payload.barcode !== undefined) body.barcode = payload.barcode || null;
  if (payload.category !== undefined) body.category = payload.category || null;
  if (payload.unit !== undefined) body.unit = payload.unit;
  if (payload.price !== undefined) body.price = payload.price ?? undefined;
  if (payload.minStock !== undefined) body.min_stock = payload.minStock;
  return body;
}

export function previewToFEFOLine(
  itemId: string,
  quantity: number,
  raw: Record<string, unknown>
): FEFOPreviewLine {
  const item = (raw.item as Record<string, unknown>) ?? {};
  const deductions = (raw.deductions as Record<string, unknown>[]) ?? [];
  const totalStock = Number(raw.totalStock ?? raw.total_stock ?? 0);

  return {
    itemId,
    itemName: (item.name as string) ?? "",
    quantity,
    sufficient: totalStock >= quantity,
    batches: deductions.map((d) => ({
      batchId: (d.batchId ?? d.batch_id) as string,
      quantity: Number(d.deductQuantity ?? d.deduct_quantity ?? 0),
      expiryDate: (d.expiryDate ?? d.expiry_date ?? null) as string | null,
    })),
  };
}

export function buildStockMovement(transactions: Transaction[]) {
  const map = new Map<string, { in: number; out: number }>();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  for (const tx of transactions) {
    const date = tx.transactionDate?.split("T")[0];
    if (!date) continue;
    if (new Date(date) < cutoff) continue;
    const entry = map.get(date) ?? { in: 0, out: 0 };
    if (tx.type === "IN") entry.in += tx.quantity;
    else entry.out += tx.quantity;
    map.set(date, entry);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }));
}
