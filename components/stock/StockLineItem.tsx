"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ItemSearchSelect } from "@/components/stock/ItemSearchSelect";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export interface StockLineFields {
  lines: {
    itemId: string;
    quantity: number;
    expiryDate?: string | null;
    notes?: string | null;
  }[];
  notes?: string | null;
  transactionDate?: string;
  shopId?: string;
}

interface StockLineItemProps {
  index: number;
  register: UseFormRegister<StockLineFields>;
  errors: FieldErrors<StockLineFields>;
  onRemove: () => void;
  canRemove: boolean;
  showExpiry?: boolean;
  itemId: string;
  onItemChange: (itemId: string) => void;
}

export function StockLineItem({
  index,
  register,
  errors,
  onRemove,
  canRemove,
  showExpiry = false,
  itemId,
  onItemChange,
}: StockLineItemProps) {
  const lineErrors = errors.lines?.[index];

  return (
    <div className="rounded-lg border border-border bg-surface-raised p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-muted">Line {index + 1}</span>
        {canRemove && (
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-muted" />
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label>Item</Label>
          <ItemSearchSelect
            value={itemId}
            onChange={(id) => onItemChange(id)}
          />
          {lineErrors?.itemId && (
            <p className="text-xs text-danger">
              {lineErrors.itemId.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`quantity-${index}`}>Quantity</Label>
          <Input
            id={`quantity-${index}`}
            type="number"
            min={1}
            {...register(`lines.${index}.quantity` as const)}
          />
          {lineErrors?.quantity && (
            <p className="text-xs text-danger">
              {lineErrors.quantity.message as string}
            </p>
          )}
        </div>

        {showExpiry && (
          <div className="space-y-2">
            <Label htmlFor={`expiry-${index}`}>Expiry Date</Label>
            <Input
              id={`expiry-${index}`}
              type="date"
              {...register(`lines.${index}.expiryDate` as const)}
            />
          </div>
        )}

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`notes-${index}`}>Notes</Label>
          <Input
            id={`notes-${index}`}
            {...register(`lines.${index}.notes` as const)}
            placeholder="Optional"
          />
        </div>
      </div>
    </div>
  );
}
