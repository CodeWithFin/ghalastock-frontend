"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemStatusBadge } from "@/components/items/ItemStatusBadge";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Item } from "@/types/item";

interface ItemRowProps {
  item: Item;
  canEdit: boolean;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function ItemRow({ item, canEdit, onEdit, onDelete }: ItemRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasBatches = item.batches.length > 0;

  return (
    <>
      <tr className="border-b border-border last:border-0 hover:bg-white/5 transition-colors">
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={() => hasBatches && setExpanded(!expanded)}
            className={cn(
              "flex items-center gap-2 text-left",
              !hasBatches && "cursor-default"
            )}
            disabled={!hasBatches}
          >
            {hasBatches ? (
              expanded ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
              )
            ) : (
              <span className="w-4" />
            )}
            <div>
              <p className="font-medium">{item.name}</p>
              {item.sku && (
                <p className="font-mono text-xs text-muted">{item.sku}</p>
              )}
            </div>
          </button>
        </td>
        <td className="hidden px-4 py-3 text-muted md:table-cell">
          {item.category ?? "—"}
        </td>
        <td className="px-4 py-3">
          {formatNumber(item.totalStock)} {item.unit}
        </td>
        <td className="hidden px-4 py-3 md:table-cell">
          <ItemStatusBadge stock={item.totalStock} minStock={item.minStock} />
        </td>
        <td className="hidden px-4 py-3 text-muted lg:table-cell">
          {item.price != null ? formatCurrency(item.price) : "—"}
        </td>
        <td className="hidden px-4 py-3 text-muted lg:table-cell">
          {item.earliestExpiry ? formatDate(item.earliestExpiry) : "—"}
        </td>
        {canEdit && (
          <td className="px-4 py-3">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-danger hover:text-danger"
                onClick={() => onDelete(item)}
              >
                Delete
              </Button>
            </div>
          </td>
        )}
      </tr>

      {expanded && hasBatches && (
        <tr className="bg-surface/30">
          <td colSpan={canEdit ? 7 : 6} className="px-4 py-3">
            <div className="ml-6 rounded-lg border border-border bg-card p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
                Batch Breakdown
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="pb-2 pr-4 font-medium">Quantity</th>
                    <th className="pb-2 font-medium">Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {item.batches.map((batch) => (
                    <tr key={batch.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-4">
                        {formatNumber(batch.quantity)} {item.unit}
                      </td>
                      <td className="py-2 text-muted">
                        {batch.expiryDate ? formatDate(batch.expiryDate) : "No expiry"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
