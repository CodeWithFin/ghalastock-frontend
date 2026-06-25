export { getStockStatus } from "./format";

export const stockStatusLabel = {
  ok: "In Stock",
  low: "Low Stock",
  out: "Out of Stock",
} as const;

export const stockStatusColor = {
  ok: "success",
  low: "warning",
  out: "danger",
} as const;

export const expiryUrgencyClass = (days: number) => {
  if (days <= 7) return "bg-red-950/40 text-red-400 border-red-900/50";
  if (days <= 30) return "bg-amber-950/40 text-amber-400 border-amber-900/50";
  if (days <= 90) return "bg-yellow-950/30 text-yellow-500 border-yellow-900/40";
  return "";
};

export const expiryRowClass = (days: number) => {
  if (days <= 7) return "border-red-900/50 bg-red-950/30";
  if (days <= 30) return "border-amber-900/50 bg-amber-950/30";
  if (days <= 90) return "border-yellow-900/40 bg-yellow-950/20";
  return "border-landing-border bg-card";
};
