import { StatusBadge } from "@/components/ui/StatusBadge";
import { getStockStatus } from "@/lib/utils/format";

interface ItemStatusBadgeProps {
  stock: number;
  minStock: number;
}

const labels = {
  ok: "In Stock",
  low: "Low Stock",
  out: "Out of Stock",
} as const;

const variants = {
  ok: "success",
  low: "warning",
  out: "danger",
} as const;

export function ItemStatusBadge({ stock, minStock }: ItemStatusBadgeProps) {
  const status = getStockStatus(stock, minStock);

  return (
    <StatusBadge variant={variants[status]}>
      {labels[status]}
    </StatusBadge>
  );
}
