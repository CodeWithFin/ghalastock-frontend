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
  if (days <= 7) return "bg-red-50 text-danger";
  if (days <= 30) return "bg-amber-50 text-warning";
  if (days <= 90) return "bg-yellow-50 text-yellow-700";
  return "";
};
