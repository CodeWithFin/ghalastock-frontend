"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ItemRow } from "@/components/items/ItemRow";
import { ItemForm } from "@/components/items/ItemForm";
import { ItemStatusBadge } from "@/components/items/ItemStatusBadge";
import { useDeleteItem, useUpdateItem } from "@/lib/hooks/useItems";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import type { ItemFormData } from "@/lib/schemas/item.schema";
import type { Item } from "@/types/item";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

interface ItemsTableProps {
  items: Item[];
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  canEdit?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ItemsTable({
  items,
  loading,
  error,
  onRetry,
  canEdit = true,
  page = 1,
  totalPages = 1,
  onPageChange,
  emptyTitle = "No items found",
  emptyDescription = "Add your first inventory item to get started.",
}: ItemsTableProps) {
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);
  const updateItem = useUpdateItem();
  const deleteItemMutation = useDeleteItem();

  const handleUpdate = (data: ItemFormData) => {
    if (!editItem) return;
    updateItem.mutate(
      { id: editItem.id, payload: data },
      { onSuccess: () => setEditItem(null) }
    );
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    deleteItemMutation.mutate(deleteItem.id, {
      onSuccess: () => setDeleteItem(null),
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-danger">{error.message}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-4">
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<Package className="h-8 w-8" />}
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-4 py-3 text-left font-medium text-muted">Item</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted md:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">Stock</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted md:table-cell">
                Status
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted lg:table-cell">
                Price
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted lg:table-cell">
                Earliest Expiry
              </th>
              {canEdit && (
                <th className="px-4 py-3 text-left font-medium text-muted">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                canEdit={canEdit}
                onEdit={setEditItem}
                onDelete={setDeleteItem}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-border bg-surface-raised p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{item.name}</p>
                {item.sku && (
                  <p className="font-mono text-xs text-muted">{item.sku}</p>
                )}
              </div>
              <ItemStatusBadge stock={item.totalStock} minStock={item.minStock} />
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Stock</span>
                <span>
                  {formatNumber(item.totalStock)} {item.unit}
                </span>
              </div>
              {item.price != null && (
                <div className="flex justify-between">
                  <span className="text-muted">Price</span>
                  <span>{formatCurrency(item.price)}</span>
                </div>
              )}
            </div>
            {canEdit && (
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditItem(item)}>
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-danger"
                  onClick={() => setDeleteItem(item)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ItemForm
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
        item={editItem}
        onSubmit={handleUpdate}
        loading={updateItem.isPending}
      />

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        title="Delete item"
        description={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteItemMutation.isPending}
        destructive
      />
    </>
  );
}
